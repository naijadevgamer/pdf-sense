"use client";

import { Send, Paperclip, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef, useState, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [rows, setRows] = useState(1);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the number of rows needed (max 3)
    const scrollHeight = textarea.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const newRows = Math.min(Math.floor(scrollHeight / lineHeight), 3);

    setRows(newRows);

    // Set the height based on scrollHeight for smooth expansion
    textarea.style.height = `${Math.min(scrollHeight, lineHeight * 3)}px`;
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim().length === 0) return;

    addMessage();

    // Blur the textarea to dismiss mobile keyboard
    textareaRef.current?.blur();

    // Reset rows after sending
    setRows(1);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200">
      <div className="mx-auto max-w-4xl px-2 py-3 sm:px-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-2 md:p-4"
        >
          <div className="flex items-end gap-1.5 sm:gap-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  rows={rows}
                  autoFocus
                  onChange={handleInputChange}
                  value={message}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ask anything about your docs..."
                  className="resize-none pr-12 text-base py-4 px-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-gray-50 min-h-[60px] max-h-[120px] placeholder:text-sm sm:placeholder:text-md overflow-y-auto"
                  disabled={isDisabled}
                />

                <AnimatePresence>
                  {isFocused && message.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-2 left-4 text-sm text-gray-500 items-center gap-1 hidden sm:flex"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>
                        Ask about summaries, insights, or specific content
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                disabled={
                  isLoading || isDisabled || message.trim().length === 0
                }
                className="size-8 sm:size-9 md:size-12 rounded-md md:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                aria-label="send message"
                onClick={handleSendMessage}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Send className="size-3 sm:size-5" />
                  </motion.div>
                ) : (
                  <Send className="size-3 sm:size-5" />
                )}
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Paperclip className="h-3 w-3" />
              <span>PDF Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Sparkles className="h-3 w-3 text-purple-500" />
              <span>AI Powered</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatInput;
