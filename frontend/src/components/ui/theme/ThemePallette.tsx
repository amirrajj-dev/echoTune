import { Palette, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../store/theme.store";

const themes = [
  { theme: "light", bg: "bg-neutral-content", text: "text-black" },
  { theme: "dark", bg: "bg-neutral", text: "text-neutral-content" },
  { theme: "forest", bg: "bg-success", text: "text-success-content" },
  { theme: "halloween", bg: "bg-secondary", text: "text-secondary-content" },
  { theme: "retro", bg: "bg-warning", text: "text-warning-content" },
  { theme: "emerald", bg: "bg-primary/70", text: "text-primary-content" },
  { theme: "night", bg: "bg-indigo-950", text: "text-white" },
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 18,
      stiffness: 180,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0 },
};

const ThemePallette = () => {
  const [showThemePallette, setShowThemePallette] = useState(false);
  const { setTheme, theme: currentTheme } = useTheme();

  const handleChangeTheme = (theme: string) => {
    setShowThemePallette(false);
    setTheme(theme);
  };

  return (
    <div className="relative z-[1000]">
      <motion.button
        onClick={() => setShowThemePallette((prev) => !prev)}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 180, damping: 18 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-soft bg-transparent border-none shadow-none text-base-content"
      >
        <Palette className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {showThemePallette && (
          <motion.div
            key="theme-palette"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-[1000] top-12 left-0 sm:left-auto right-auto sm:right-0 w-56 p-3 bg-base-200/80 backdrop-blur-sm rounded-xl shadow-lg flex flex-col gap-2"
          >
            {themes.map((theme) => (
              <motion.button
                key={theme.theme}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChangeTheme(theme.theme)}
                className={`btn btn-sm justify-between rounded-md px-3 font-medium flex items-center capitalize transition-all ${theme.bg} ${theme.text}`}
              >
                {theme.theme}
                {currentTheme === theme.theme && <Check className="w-4 h-4" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemePallette;