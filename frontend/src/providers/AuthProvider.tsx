import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../configs/axios";
import { motion } from "framer-motion";
import { Music3 } from "lucide-react";
import { useTheme } from "../store/theme.store";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";
import { toast } from "sonner";

const updateApiToken = (token: string | null) => {
  if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  const { checkAdminStatus } = useAuthStore();
  const [loading, setLoading] = useState(true); // Start as true
  const { theme } = useTheme();
  const { initSocket, disconnectSocket } = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token){
          toast.error("You are not logged in");
          return
        }
        updateApiToken(token);
        if (token && userId) {
          await checkAdminStatus();
          initSocket(userId);
        }
      } catch (error) {
        console.error("Auth error:", error);
        updateApiToken(null);
        toast.error("Authentication failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initAuth();

    return () => {
      disconnectSocket();
    };
  }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${
          theme === "dark"
            ? "bg-base-300"
            : theme === "retro"
            ? "bg-retro"
            : "bg-gradient-to-br from-primary to-secondary"
        } h-screen text-white`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white/20 shadow-xl backdrop-blur-md"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
          >
            <Music3 className="w-8 h-8 text-white" />
            <span className="absolute w-full h-full rounded-full border-2 border-white/20 animate-pulse"></span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold tracking-wide drop-shadow-sm"
          >
            Loading your vibe...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-white/80 tracking-wide text-center"
          >
            Spinning the beat 🎵💙
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;