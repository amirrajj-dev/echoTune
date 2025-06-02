import { Link } from "react-router-dom";
import Logo from "./Logo";
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/clerk-react";
import SignInWithGoogleBtn from "./SignInWithGoogleBtn";
import { motion } from "framer-motion";
import { Heart, LayoutDashboard, Menu, Music2 } from "lucide-react";
import ThemePallette from "./theme/ThemePallette";
import { useEffect } from "react";
import { useMusic } from "../../store/music.store";
import { useAuthStore } from "../../store/auth.store";
import { useQueryClient } from "@tanstack/react-query";

const TopBar = () => {
  const { isSignedIn } = useAuth();
  const { isShowMusicPlayer, setIsShowMusicPlayer, currentSong } = useMusic();
  const { isLoading, isAdmin } = useAuthStore();

  const queryClient = useQueryClient();
  useEffect(() => {
    if (isSignedIn) return;
    queryClient.removeQueries({ queryKey: ["friends"] });
  }, [isSignedIn, queryClient]);

  if (isLoading) {
    return (
      <motion.div
        className="z-50 bg-base-100/60 backdrop-blur-lg rounded-t-xl shadow-xl px-6 py-4 mx-auto max-w-6xl flex items-center justify-between border border-white/10 animate-pulse"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-8 w-28 bg-base-300 rounded-md" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-base-300" />
          <div className="h-8 w-8 rounded-full bg-base-300" />
          <div className="h-8 w-32 rounded-md bg-base-300" />
          <div className="h-10 w-10 rounded-full bg-base-300" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="">
      <div className="drawer">
        <input id="topbar-drawer" type="checkbox" className="drawer-toggle" />

        <motion.div
          className="drawer-content w-full bg-base-100/60 backdrop-blur-lg border border-white/10 shadow-xl px-6 py-4 mx-auto max-w-6xl rounded-xl flex flex-wrap items-center justify-between z-[900]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Logo />
          </motion.div>

          {/* Desktop-only items */}
          <motion.div
            className="hidden sm:flex items-center gap-3"
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
            <Link to={'/favourites'}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-circle bg-transparent border-none shadow-none transition"
              >
                <Heart className="w-5 h-5" />
              </motion.button>
            </Link>

            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <ThemePallette />
            </motion.div>
            {currentSong && (
              <motion.button
                onClick={() => setIsShowMusicPlayer(!isShowMusicPlayer)}
                className="btn btn-success tooltip tooltip-left btn-sm btn-soft btn-circle"
                whileHover={{ rotate: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                data-tip={
                  isShowMusicPlayer ? "Hide Music player" : "Show Music player"
                }
              >
                <Music2 size={16} />
              </motion.button>
            )}

            {isAdmin && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -5 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link to="/admin-dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn bg-gradient-to-br from-primary to-secondary text-white"
                  >
                    <LayoutDashboard size={16} />
                    Admin
                  </motion.button>
                </Link>
              </motion.div>
            )}

            <SignedOut>
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <SignInWithGoogleBtn />
              </motion.div>
            </SignedOut>

            <SignedIn>
              <motion.div
                whileTap={{ scale: 0.95 }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <UserButton />
              </motion.div>
            </SignedIn>
          </motion.div>

          {/* Mobile menu button */}
          <motion.div className="sm:hidden">
            <label
              htmlFor="topbar-drawer"
              className="btn btn-circle bg-gradient-to-tr from-primary to-secondary drawer-button text-white"
            >
              <Menu />
            </label>
          </motion.div>
        </motion.div>

        {/* Drawer side content */}
        <div className="drawer-side z-[910]">
          <label
            htmlFor="topbar-drawer"
            className="drawer-overlay z-[900]"
          ></label>
          <ul className="menu z-[920] p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
            <li>
              <button className="btn btn-ghost justify-start gap-2 text-rose-500">
                <Heart className="w-5 h-5" /> Favorites
              </button>
            </li>
            <li>
              <ThemePallette />
            </li>
            <li>
              {currentSong && (
                <motion.button
                  onClick={() => setIsShowMusicPlayer(!isShowMusicPlayer)}
                  className="btn btn-success tooltip tooltip-right btn-soft btn-circle rotate-360"
                  data-tip={
                    isShowMusicPlayer
                      ? "Hide Music player"
                      : "Show Music player"
                  }
                >
                  <Music2 />
                </motion.button>
              )}
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin-dashboard" className="btn btn-outline gap-2">
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </Link>
              </li>
            )}
            <SignedOut>
              <li>
                <SignInWithGoogleBtn />
              </li>
            </SignedOut>
            <SignedIn>
              <li>
                <UserButton afterSignOutUrl="/" />
              </li>
            </SignedIn>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
