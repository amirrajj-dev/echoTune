import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { axiosInstance } from "../../configs/axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const {isLoaded , user} = useUser()
  const navigate = useNavigate()
  const syncAttempted = useRef(false);

  useEffect(()=>{
    const syncUser = async ()=>{
      if (!isLoaded || !user || syncAttempted.current) return
      try {
        syncAttempted.current = true;

       await axiosInstance.post('/auth/callback' , {
          id  : user.id ,
          firstName : user.firstName ,
          lastName : user.lastName ,
          imageUrl : user.imageUrl
        });
      } catch (error) {
        console.log('error in auth-callback page => ' , error);
      }finally{
        navigate('/')
      }
    }
    syncUser()
  } , [isLoaded , navigate , user])
  return (
    <div className="h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card w-full max-w-sm bg-base-100/60 backdrop-blur-lg rounded-xl shadow-xl"
      >
        <div className="card-body items-center text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="p-3 rounded-full bg-primary/10 text-primary shadow-inner"
          >
            <Loader2 className="w-8 h-8" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold"
          >
            Logging you in...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-base-content/60"
          >
            Redirecting 🎵💙
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallbackPage;