import { db } from "@/db";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";
import { getHuggingFaceEmbeddings, hf } from "@/lib/huggingface";
import { StreamingTextResponse } from "ai";

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

    // Generate embeddings using Hugging Face
    console.log("Generating embeddings for the message...");
    const embeddingResponse = await getHuggingFaceEmbeddings(message);
    console.log("Embeddings generated successfully.");

    const embeddings = embeddingResponse;

    // Query Pinecone for similar vectors
    console.log("Connecting to Pinecone client...");
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    console.log("Pinecone index initialized. Querying Pinecone...");

    const searchResults = await pineconeIndex.query({
      vector: embeddings,
      topK: 4,
      includeMetadata: true,
    });
    console.log(
      "Pinecone query executed successfully. Search results:",
      searchResults
    );

    const retrievedText = searchResults.matches
      .map((match) => match.metadata?.text)
      .filter(Boolean)
      .join("\n");

    console.log(
      "Retrieved text from Pinecone:",
      retrievedText || "No matches found."
    );

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
    const aiPrompt = `
    Use the following context (or previous conversation if needed) to answer the user's question in markdown format.
    If you don't know the answer, just say that you don't know.

    \n----------------\n
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n")}

    \n----------------\n
    CONTEXT:
    ${retrievedText}

    USER INPUT: ${message}
    `;

    console.log("AI prompt constructed. Sending request to AI model...");

    // Stream AI response
    const responseStream = hf.textGenerationStream({
      model: "mistralai/Mistral-7B-Instruct-v0.1",
      inputs: aiPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        repetition_penalty: 1.2,
        stop: ["User:", "Assistant:"],
      },
    });

    console.log("AI response streaming initialized.");

    // Convert AsyncGenerator to ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        let generatedText = ""; // Store the generated text
        try {
          // Pull data from the AsyncGenerator
          for await (const chunk of responseStream) {
            const text = chunk.generated_text;
            if (text != null) {
              controller.enqueue(text);
              generatedText += text;
              console.log("Generated text chunk:", text);
            } else {
              console.warn(
                "Warning: Received null or undefined text chunk, skipping."
              );
            }
          }

          console.log(
            "AI response generation completed. Storing in database..."
          );
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
      console.log("Storing final AI-generated message in database...");
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          fileId, // Ensure this is defined in your context
          userId, // Ensure this is defined in your context
        },
      });
      console.log("AI-generated message stored successfully.");
    }

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    return new Response("Error processing request", { status: 500 });
  }
};
