import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/clerk-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";
import { motion } from "framer-motion";
import { Heart, LayoutDashboard } from "lucide-react";

const TopBar = () => {
  const isAdmin = true;

  return (
    <motion.div
      className="sticky top-4 z-50 bg-base-100/60 backdrop-blur-lg rounded-xl shadow-xl px-6 py-4 mx-auto max-w-6xl flex items-center justify-between border border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Logo />
      <div className="flex items-center gap-3">
        <button className="btn btn-circle bg-transparent border-none shadow-none hover:scale-110 transition-all duration-200 ease-in-out">
          <Heart className="w-5 h-5 hover:fill-rose-500" />
        </button>
        {isAdmin && (
          <Link to="/admin-dashboard">
            <button className="btn bg-gradient-to-br from-primary to-secondary hover:scale-105 transition-transform">
              Admin Dashboard
              <LayoutDashboard size={16} />
            </button>
          </Link>
        )}
        <SignedOut>
          <SignInWithGoogleBtn />
        </SignedOut>
        <SignedIn>
          <motion.div whileTap={{ scale: 0.95 }}>
            <SignOutButton>
              <button className="btn btn-error hover:scale-105 transition-transform">
                Sign Out
              </button>
            </SignOutButton>
          </motion.div>
        </SignedIn>
      </div>
    </motion.div>
  );
};

export default TopBar;
