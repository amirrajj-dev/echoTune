import { motion, AnimatePresence } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, Send, Smile } from "lucide-react";
import { useTheme } from "../../../../../store/theme.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useChatStore } from "../../../../../store/chat.store";
import type { IMessage } from "../../../../../interfaces/interfaces";
import { useUser } from "@clerk/clerk-react";

type EmojiObject = {
  native: string;
};

const MessageInput = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { socket, selectedUser } = useChatStore();
  const { user } = useUser();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!content || !selectedUser?._id || !user?.id) {
        throw new Error("Missing required fields: message, recipient, or sender");
      }
      socket.emit("send_message", {
        senderId: user.id,
        receiverId: selectedUser.clerkId,
        content,
      });
      setMessage("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to send message");
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handleMessageSent = (message: IMessage) => {
      if (
        message.senderId === user?.id &&
        message.receiverId === selectedUser?._id
      ) {
        setMessage("");
        inputRef.current?.focus();
        inputRef.current!.style.height = "auto";
        queryClient.invalidateQueries({
          queryKey: ["messages", selectedUser?._id],
        });
      }
    };

    const handleMessageError = (error: string) => {
      toast.error(error || "Failed to send message");
    };

    socket.on("message_sent", handleMessageSent);
    socket.on("message_error", handleMessageError);

    return () => {
      socket.off("message_sent", handleMessageSent);
      socket.off("message_error", handleMessageError);
    };
  }, [socket, user?.id, selectedUser?._id, queryClient]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      emojiButtonRef.current &&
      !emojiButtonRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleEmojiSelect = (emoji: EmojiObject) => {
    setMessage((prev) => prev + emoji.native);
    inputRef.current?.focus();
  };

  const handleSendMessage = () => {
    if (message.trim().length > 0) {
      sendMessage(message);
    }
  };

  const handleTyping = () => {
    if (socket && message.length > 0 && selectedUser?._id && user?.id) {
      socket.emit("typing", { userId: user.id, receiverId: selectedUser.clerkId });
    }
  };

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      handleTyping();
    }, 500);
    return () => clearTimeout(typingTimeout);
  }, [message, socket, selectedUser?._id, user?.id]);

  const autoResize = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="mt-auto p-4 pt-2 flex items-end gap-2 w-full relative">
      <textarea
        ref={inputRef}
        id="messageInput"
        value={message}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        onChange={(e) => {
          setMessage(e.target.value);
          autoResize();
        }}
        placeholder="Send a message"
        className="w-full max-h-40 p-4 pr-20 rounded-md bg-base-100 backdrop-blur-md focus:outline-none focus:border-b focus:border-base-content/20 resize-none overflow-y-auto leading-relaxed"
      />

      {/* Emoji Picker Toggle Button */}
      <button
        ref={emojiButtonRef}
        onClick={() => {
          setShowEmojiPicker((prev) => !prev);
        }}
        aria-label="Toggle emoji picker"
        className="absolute right-20 bottom-6 btn btn-circle bg-base-content/5 text-base-content/70 hover:bg-base-content/10 border-none"
      >
        <Smile className="w-6 h-6" />
      </button>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        aria-label="Send message"
        disabled={isPending}
        className="absolute right-6 bottom-6 btn btn-circle bg-base-content/5 text-base-content/70 hover:bg-base-content/10 border-none disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="loading loading-spinner loading-md">
            <Loader2 />
          </span>
        ) : (
          <Send className="w-6 h-6" />
        )}
      </button>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            key="emoji-picker"
            ref={emojiPickerRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-4 z-50"
          >
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={
                theme === "light" || theme === "emerald" || theme === "retro"
                  ? "light"
                  : "dark"
              }
              emojiSize={20}
              previewPosition="none"
              skinTonePosition="none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageInput;