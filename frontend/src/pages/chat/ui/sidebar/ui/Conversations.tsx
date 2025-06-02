import { motion } from "framer-motion";
import Conversation from "./Conversation";
import type { IUser } from "../../../../../interfaces/interfaces";
import ConversationSkeleton from "../../../../../components/ui/skeletons/ConversationSkeleton";
import { useChatStore } from "../../../../../store/chat.store";
import { useSidebar } from "../../../../../store/sidebar.store";
import { useFriends } from "../../../../../hooks/firend.hook";
import { useEffect } from "react";

const Conversations = () => {
  const { setSelectedUser, setUsers } = useChatStore();
  const { setIsSidebarOpen , setAllUsers , filteredUsers , query } = useSidebar();
  const { data: conversations, isPending } = useFriends();
  const isSeachActive = filteredUsers().length > 0 && query.length > 0;
  const conversationsToShow = isSeachActive ? filteredUsers() : conversations;
console.log(conversationsToShow);
  useEffect(() => {
    if (conversations && conversations?.length > 0) {
      setUsers(conversations);
      setAllUsers(conversations);
    }
  }, [conversations, setUsers , setAllUsers]);

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    if (window.innerWidth < 768){
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {!isPending
        ? conversationsToShow?.map((conversation) => (
            <Conversation
              key={conversation._id}
              user={conversation}
              handleSelectUser={handleSelectUser}
            />
          ))
        : Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ConversationSkeleton key={index + 1} />
            </motion.div>
          ))}
    </div>
  );
};

export default Conversations;