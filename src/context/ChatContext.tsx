"use client";

import { ReactNode, createContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { toast } from "sonner";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  retryMessage: () => void;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
  retryMessage: () => {},
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastError, setLastError] = useState<{
    message: string;
    timestamp: number;
  } | null>(null);

  const utils = trpc.useUtils();
  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      try {
        const response = await fetch("/api/message", {
          method: "POST",
          body: JSON.stringify({
            fileId,
            message,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to send message");
        }

        return response.body;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    },

    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");
      setLastError(null); // Clear previous errors when trying again

      await utils.getFileMessages.cancel();

      const previousMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          let newPages = [...old.pages];
          let latestPage = newPages[0]!;

          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];

          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        setLastError({
          message: backupMessage.current,
          timestamp: Date.now(),
        });
        return toast.error("There was a problem sending this message", {
          description: "Please refresh this page and try again",
          action: {
            label: "Retry",
            onClick: () => retryMessage(),
          },
          duration: 10000,
        });
      }

      try {
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accResponse = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (doneReading && !value) {
            break;
          }

          const chunkValue = decoder.decode(value);
          accResponse += chunkValue;

          utils.getFileMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERY_LIMIT },
            (old) => {
              if (!old) return { pages: [], pageParams: [] };

              let isAiResponseCreated = old.pages.some((page) =>
                page.messages.some((message) => message.id === "ai-response")
              );

              let updatedPages = old.pages.map((page) => {
                if (page === old.pages[0]) {
                  let updatedMessages;

                  if (!isAiResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().toISOString(),
                        id: "ai-response",
                        text: accResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ];
                  } else {
                    updatedMessages = page.messages.map((message) => {
                      if (message.id === "ai-response") {
                        return {
                          ...message,
                          text: accResponse,
                        };
                      }
                      return message;
                    });
                  }

                  return {
                    ...page,
                    messages: updatedMessages,
                  };
                }

                return page;
              });

              return { ...old, pages: updatedPages };
            }
          );
        }
      } catch (error) {
        setLastError({
          message: backupMessage.current,
          timestamp: Date.now(),
        });
        toast.error("Connection interrupted", {
          description: "The response was cut short. Please try again.",
          action: {
            label: "Retry",
            onClick: () => retryMessage(),
          },
          duration: 10000,
        });
        await utils.getFileMessages.invalidate({ fileId });
      }
    },

    onError: (error: any, __, context) => {
      setLastError({
        message: backupMessage.current,
        timestamp: Date.now(),
      });

      toast.error("Failed to send message", {
        description: error.message || "Please try again.",
        action: {
          label: "Retry",
          onClick: () => retryMessage(),
        },
        duration: 10000,
      });

      setMessage(backupMessage.current);
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (_old) => ({
          pages: [{ messages: context?.previousMessages ?? [] }],
          pageParams: [],
        })
      );
    },

    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => {
    if (isLoading || message.trim() === "") return;
    sendMessage({ message });
  };

  const retryMessage = () => {
    if (lastError?.message) {
      setMessage(lastError.message);
      setTimeout(() => {
        sendMessage({ message: lastError.message });
      }, 10);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
        retryMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
