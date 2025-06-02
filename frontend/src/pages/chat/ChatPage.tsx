import { useSidebar } from "../../store/sidebar.store";
import MessageContainer from "./ui/chat/MessageContainer";
import { motion } from "framer-motion";
import Sidebar from "./ui/sidebar/Sidebar";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import SignInWithGoogleBtn from "../../components/ui/SignInWithGoogleBtn";
import Logo from "../../components/ui/Logo";

const ChatPage = () => {
  const { isSidebarOpen, setIsSidebarOpen, toggleSidebar } = useSidebar();
  const { isSignedIn } = useAuth();
  useEffect(() => {
    return () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
  }, [setIsSidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  if (!isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-[80vh] bg-base-100/70 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-4 sm:p-6 relative overflow-hidden items-center justify-center"
      >
        <div className="z-10 flex flex-col items-center text-center gap-4">
          <Logo />
          <h2 className="text-2xl font-bold text-base-content">
            You’re not signed in
          </h2>
          <p className="text-sm text-base-content/80 max-w-xs">
            Please sign in to access your chats and continue the conversation.
          </p>
          <SignInWithGoogleBtn />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex h-[80vh] bg-base-100/60 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 p-2 xs:p-3 sm:p-4 min-h-0 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Sidebar Toggle Button (Mobile Only) */}
      <button
        className={`md:hidden absolute top-4 left-4 z-50 btn btn-circle btn-sm bg-base-content/10 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Backdrop (Mobile Only) */}
      {isSidebarOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: isSidebarOpen ? 0 : -100,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`w-3/4 xs:w-64 sm:w-72 max-w-[280px] backdrop-blur-md z-40 shadow-xl transition-transform duration-300 ease-in-out fixed md:relative md:flex top-0 bottom-0 md:h-full ${
          isSidebarOpen ? "flex" : "hidden"
        }`}
      >
        <Sidebar />
      </motion.div>

      {/* Message Container */}
      <div className="flex-1 h-full min-w-0">
        <MessageContainer />
      </div>
    </motion.div>
  );
};

export default ChatPage;
