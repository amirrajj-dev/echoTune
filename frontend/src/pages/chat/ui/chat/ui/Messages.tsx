import MessageBubble from "./MessageBubble";
import MessageBubbleSkeleton from "../../../../../components/ui/skeletons/MessageBubbleSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import type { IMessage } from "../../../../../interfaces/interfaces";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useChatStore } from "../../../../../store/chat.store";
import { useMessages } from "../../../../../hooks/message.hook";
import { useUser } from "@clerk/clerk-react";

const Messages = () => {
  const { selectedUser, socket, setMessages } = useChatStore();
  const { user } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const {
    data: messages,
    isLoading,
    error,
  } = useMessages(selectedUser ? selectedUser.clerkId : "");

  useEffect(() => {
    if (messages && messages?.length > 0) setMessages(messages);
  }, [setMessages, messages]);

  const handleStartConversationClick = () => {
    const inputElement = document.getElementById("messageInput") as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !selectedUser?.clerkId) return;

    const handleNewMessage = (message: IMessage) => {
      queryClient.setQueryData(
        ["messages", selectedUser.clerkId],
        (oldData: IMessage[] | undefined) => {
          if (!oldData) return [message];
          if (oldData.some((msg) => msg._id === message._id)) return oldData;
          return [...oldData, message];
        }
      );
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [socket, queryClient, selectedUser?.clerkId]);

  if (!selectedUser) return null;

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {[...Array(5)].map((_, i) => (
          <MessageBubbleSkeleton key={i} isCurrentUser={i % 2 === 0} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-sm">Failed to load messages.</div>
    );
  }

  return (
    <div className="p-6 flex flex-col max-h-[calc(100vh-200px)] gap-4">
      {messages?.length ? (
        <>
          {messages.map(({ _id, senderId, content, createdAt }) => (
            <MessageBubble
              key={_id}
              sender={senderId === user?.id ? "currentUser" : "chat"}
              text={content}
              avatar={
                senderId === user?.id ? user.imageUrl : selectedUser.imageUrl
              }
              timestamp={new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))}
          <div ref={bottomRef} />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center mt-32 gap-4 text-center text-base-content/60"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base font-mono"
          >
            No messages yet. Start chatting!
          </motion.p>
          <motion.button
            onClick={handleStartConversationClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary btn-sm rounded-full"
          >
            Send a Message
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Messages;