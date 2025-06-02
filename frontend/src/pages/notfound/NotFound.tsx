import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Ghost } from "lucide-react";
import Logo from "../../components/ui/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full flex items-center justify-center px-2 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute w-96 h-96 bg-accent rounded-full blur-3xl opacity-20 top-10 left-10"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute w-72 h-72 bg-primary rounded-full blur-2xl opacity-20 bottom-10 right-10"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ rotateX: 3, rotateY: -3 }}
        className="z-10 bg-base-200 backdrop-blur-md shadow-xl rounded-2xl p-10 flex flex-col items-center gap-6 max-w-md w-full transform-gpu"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <Logo />
          <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-primary text-transparent bg-clip-text">
            404
          </h1>
          <p className="text-lg text-base-content/80">Page not found</p>
          <p className="text-sm text-base-content/60">
            You might be off-beat. Let’s get you back.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-30 animate-pulse" />
          <Ghost className="w-16 h-16 text-primary relative z-10" />
        </motion.div>

        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="btn btn-wide relative overflow-hidden bg-gradient-to-br from-primary to-accent text-white"
        >
          <span className="relative z-10">Take me home</span>
          <div className="absolute inset-0 z-0 before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:animate-[shimmer_2s_infinite] before:-skew-x-12" />
        </motion.button>
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="btn btn-wide relative overflow-hidden bg-gradient-to-tr from-primary to-accent text-white"
        >
          <span className="relative z-10">Go Back</span>
          <div className="absolute inset-0 z-0 before:content-[''] before:absolute before:inset-0 before:bg-white/10 before:animate-[shimmer_2s_infinite] before:-skew-x-12" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;