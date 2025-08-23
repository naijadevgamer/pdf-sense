import { db } from "@/db";
import { hf } from "@/lib/huggingface";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { PineconeStore } from "@langchain/pinecone";
import { StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Parse request body
    const body = await req.json();

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { id: userId } = user;

    if (!userId) return new Response("Unauthorized", { status: 401 });

    // Validate input
    const { fileId, message } = SendMessageValidator.parse(body);

    // Check if the file exists and belongs to the user
    const file = await db.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) return new Response("Not found", { status: 404 });

    // Save user message to database
    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    });

    console.log("Received message:", message);

    // 1: vectorize message
    // Initialize Hugging Face embeddings
    console.log("Generating embeddings for the message...");
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY!, // Use your Hugging Face API key
    });

    console.log("Embeddings generated successfully.");

    // Query Pinecone for similar vectors
    console.log("Connecting to Pinecone client...");
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    console.log("Pinecone index initialized. Querying Pinecone...");
    console.log("file.id:", file.id);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const results = await vectorStore.similaritySearch(message, 4);
    console.log(
      "Pinecone query executed successfully. Search results:",
      results
    );

    const retrievedText = results.map((r) => r.pageContent).join("\n\n");

    // Fetch previous messages
    console.log("Fetching previous messages from database...");
    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
      take: 6,
    });
    console.log(`Fetched ${prevMessages.length} previous messages.`);

    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    // Construct AI prompt
    console.log("Constructing AI prompt...");

    function processMessages(
      messages: { isUserMessage: boolean; text: string }[]
    ) {
      if (messages.length === 0) return [];

      let processedMessages: { role: "user" | "assistant"; content: string }[] =
        [];
      let lastMessage = messages[0];

      for (let i = 1; i < messages.length; i++) {
        if (messages[i].isUserMessage === lastMessage.isUserMessage) {
          // Merge consecutive messages with the same role
          lastMessage.text += " " + messages[i].text;
        } else {
          // Push merged message before moving to a new role
          processedMessages.push({
            role: lastMessage.isUserMessage ? "user" : "assistant",
            content: lastMessage.text,
          });
          lastMessage = messages[i];
        }
      }

      // Push the last merged message
      processedMessages.push({
        role: lastMessage.isUserMessage ? "user" : "assistant",
        content: lastMessage.text,
      });

      // If the last message is from the user, remove it to prevent consecutive user messages
      if (
        processedMessages.length > 0 &&
        processedMessages[processedMessages.length - 1].role === "user"
      ) {
        processedMessages.pop();
      }

      return processedMessages;
    }

    console.log(processMessages(prevMessages));

    console.log("AI prompt constructed. Sending request to AI model...");

    // Stream AI response
    const responseStream = hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant. Use the provided context from the retrieved text to answer questions accurately. If the answer isn't in the context, say you don't know.\n\n" +
            `Context from document:\n\n${retrievedText}`,
        },

        ...processMessages(prevMessages),
        {
          role: "user",
          content: message, // The latest user question
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("AI response streaming initialized.");

    const stream = new ReadableStream({
      async start(controller) {
        let generatedText = ""; // Store the generated text
        try {
          // Pull data from the AsyncGenerator
          for await (const chunk of responseStream) {
            if (chunk.choices && chunk.choices.length > 0) {
              const text = chunk.choices[0].delta.content;
              if (text) {
                controller.enqueue(text);
                generatedText += text;
                console.log("Generated text chunk:", text);
              }
            } else {
              console.warn("Warning: Received an empty chunk, skipping.");
            }
          }

          console.log(
            "AI response generation completed. Storing in database..."
          );
          console.log(generatedText);
          await onCompletion(generatedText);
          controller.close();
        } catch (error) {
          console.error("Error during AI response streaming:", error);
          controller.error(error);
        }
      },
    });

    // Define onCompletion callback
    async function onCompletion(completion: string) {
      console.log("AI response:", completion);

      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId,
          userId,
        },
      });
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return new Response("Error processing request", { status: 500 });
  }
};
