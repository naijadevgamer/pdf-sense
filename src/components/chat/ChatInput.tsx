// import { Send } from "lucide-react";
// import { Button } from "../ui/button";
// import { Textarea } from "../ui/textarea";
// import { useContext, useRef } from "react";
// import { ChatContext } from "@/context/ChatContext";

// interface ChatInputProps {
//   isDisabled?: boolean;
// }

// const ChatInput = ({ isDisabled }: ChatInputProps) => {
//   const { addMessage, handleInputChange, isLoading, message } =
//     useContext(ChatContext);

//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   return (
//     <div className=" w-full">
//       <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last: lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
//         <div className="relative flex h-full flex-1 items-stretch md:flex-col">
//           <div className="relative flex flex-col w-full flex-grow p-3">
//             <div className="relative">
//               <Textarea
//                 rows={1}
//                 ref={textareaRef}
//                 maxRows={4}
//                 autoFocus
//                 onChange={handleInputChange}
//                 value={message}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     addMessage();
//                     textareaRef.current?.focus();
//                   }
//                 }}
//                 placeholder="Enter your question..."
//                 className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
//               />

//               <Button
//                 disabled={isLoading || isDisabled}
//                 className="absolute bottom-1.5 right-[8px]"
//                 aria-label="send message"
//                 onClick={() => {
//                   addMessage();
//                   textareaRef.current?.focus();
//                 }}
//               >
//                 <Send className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;

// components/chat/ChatInput.tsx
"use client";

import { Send, Paperclip, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef, useState } from "react";
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
                  rows={1}
                  ref={textareaRef}
                  maxRows={4}
                  autoFocus
                  onChange={handleInputChange}
                  value={message}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addMessage();
                      textareaRef.current?.focus();
                    }
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Ask anything about your docs..."
                  className="resize-none pr-12 text-base py-4 px-4 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl bg-gray-50 min-h-[60px] placeholder:text-sm sm:placeholder:text-md truncate"
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
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
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
