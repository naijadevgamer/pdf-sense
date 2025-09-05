"use client";

import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import { User, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("flex items-end gap-1.5 sm:gap-2", {
          "justify-end": message.isUserMessage,
        })}
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={cn(
            "relative flex size-6 sm:size-8 aspect-square items-center justify-center rounded-xl shadow-sm shrink-0",
            {
              "order-2 bg-gradient-to-r from-blue-600 to-purple-600":
                message.isUserMessage,
              "order-1 bg-gradient-to-r from-gray-600 to-gray-700":
                !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <User className="size-3 sm:size-4 shrink-0 text-white" />
          ) : (
            <Bot className="size-3 sm:size-4 shrink-0 text-white" />
          )}
        </motion.div>

        {/* Message Content */}
        <div
          className={cn("flex flex-col space-y-1 max-w-md", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={cn("px-2 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm", {
              "bg-gradient-to-r from-blue-600 to-purple-600 text-white":
                message.isUserMessage,
              "bg-white text-gray-900 border border-gray-200":
                !message.isUserMessage,
              "rounded-br-sm":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-sm":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <div
                className={cn("prose prose-sm max-w-none", {
                  "prose-invert": message.isUserMessage,
                })}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 rounded-lg p-3 overflow-x-auto my-2">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            ) : (
              message.text
            )}

            {message.id !== "loading-message" && (
              <div
                className={cn("text-xs mt-2 flex items-center gap-1", {
                  "text-blue-100": message.isUserMessage,
                  "text-gray-500": !message.isUserMessage,
                })}
              >
                {!message.isUserMessage && <Sparkles className="h-3 w-3" />}
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

Message.displayName = "Message";

export default Message;
