import { useAuth } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../configs/axios";
import { motion } from "framer-motion";
import { Music3 } from "lucide-react";
import { useTheme } from "../store/theme.store";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        updateApiToken(token);
      } catch (error) {
        updateApiToken(null);
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center ${
          theme === "dark"
            ? "bg-base-300"
            : theme === "night"
            ? "bg-base-300"
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
            className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white/10 shadow-xl backdrop-blur-md"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
          >
            <Music3 className="w-8 h-8 text-white" />
            <span className="absolute w-full h-full rounded-full border-2 border-white/20 animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold tracking-wide drop-shadow-lg"
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
