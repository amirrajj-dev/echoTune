import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";
import { motion } from "framer-motion";
import { Heart, LayoutDashboard } from "lucide-react";
import ThemePallette from "./theme/ThemePallette";

const TopBar = () => {
  const isAdmin = true;

  return (
    <motion.div
      className="sticky top-4 z-50 bg-base-100/60 backdrop-blur-lg rounded-t-xl shadow-xl px-6 py-4 mx-auto max-w-6xl flex items-center justify-between border border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Logo />
      </motion.div>

      <motion.div
        className="flex items-center gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-circle bg-transparent border-none shadow-none text-rose-500 hover:bg-rose-100 transition"
        >
          <Heart className="w-5 h-5" />
        </motion.button>

        <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
          <ThemePallette />
        </motion.div>

        {isAdmin && (
          <motion.div variants={{ hidden: { opacity: 0, y: -5 }, visible: { opacity: 1, y: 0 } }}>
            <Link to="/admin-dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-gradient-to-br from-primary to-secondary text-white"
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </motion.button>
            </Link>
          </motion.div>
        )}

        <SignedOut>
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <SignInWithGoogleBtn />
          </motion.div>
        </SignedOut>

        <SignedIn>
          <motion.div whileTap={{ scale: 0.95 }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <UserButton />
          </motion.div>
        </SignedIn>
      </motion.div>
    </motion.div>
  );
};

export default TopBar;