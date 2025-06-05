import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Music2Icon } from "lucide-react";

const NoChatSelected = () => {
  const  {user} = useUser()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center sm:mx-auto px-6 py-12 rounded-xl bg-base-300 backdrop-blur-md shadow-lg"
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-3xl"
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 flex items-center justify-center w-full h-full shadow-inner">
        <div className="bg-gradient-to-br from-primary to-secondary size-12 rounded-full shadow-sm flex items-center justify-center">
        <Music2Icon/>
        </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-base-content drop-shadow-sm mb-3">
        Welcome, <span className="text-primary">{user?.firstName}</span>
      </h1>

      <p className="text-base-content/70 mb-8 text-sm sm:text-base leading-relaxed">
        {window.innerWidth >= 768 ? `
          Select a conversation on the left to start messaging. This area will
        update when you choose a chat.
        ` : `
          click on the toggle menu button on the top left to select a conversation
        `}
      </p>

      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="text-5xl animate-pulse">👋</div>
      </motion.div>
    </motion.div>
  );
};

export default NoChatSelected;