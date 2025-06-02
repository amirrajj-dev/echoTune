import type{ FC } from "react";
import { motion } from "framer-motion";

interface MessageBubbleSkeletonProps {
  isCurrentUser?: boolean;
}

const MessageBubbleSkeleton: FC<MessageBubbleSkeletonProps> = ({ isCurrentUser = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0.4, x: isCurrentUser ? -30 : 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="px-2 sm:px-4"
    >
      <div className={`chat ${isCurrentUser ? "chat-start" : "chat-end"}`}>
        <div className="chat-image avatar">
          <div className="w-8 sm:w-10 rounded-full skeleton bg-base-200" />
        </div>

        <div
          className={`chat-bubble min-w-[4rem] min-h-[4rem] sm:max-w-md p-4 rounded-lg skeleton ${
            isCurrentUser ? "bg-base-100" : "bg-primary/60"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default MessageBubbleSkeleton;
