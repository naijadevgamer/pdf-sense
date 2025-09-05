import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Brain, Loader2, MessageSquare, Sparkles } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useIntersection } from "@mantine/hooks";
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage, error } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  // Handle errors
  if (error) {
    toast.error("Failed to load messages", {
      description:
        error.message || "Something went wrong while fetching messages.",
    });
  }

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span>AI is thinking...</span>
      </div>
    ),
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <AnimatePresence mode="popLayout">
      <div className="flex max-h-[calc(100vh-15.15rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {combinedMessages && combinedMessages.length > 0 ? (
          combinedMessages.map((message, i) => {
            const isNextMessageSamePerson =
              combinedMessages[i - 1]?.isUserMessage ===
              combinedMessages[i]?.isUserMessage;

            if (i === combinedMessages.length - 1) {
              return (
                <Message
                  ref={ref}
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
            } else
              return (
                <Message
                  message={message}
                  isNextMessageSamePerson={isNextMessageSamePerson}
                  key={message.id}
                />
              );
          })
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
              >
                <Skeleton height={20} className="mb-2" />
                <Skeleton height={16} width="80%" />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start the Conversation
            </h3>
            <p className="text-gray-600 mb-4">
              Ask your first question to unlock AI-powered insights from your
              document.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span>Powered by advanced AI technology</span>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default Messages;
