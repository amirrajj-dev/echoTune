import { Music3 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"}>
      <motion.div
        className="flex items-center gap-2 cursor-pointer select-none"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Music3 className="w-6 h-6 text-white" />
        </motion.div>
        <motion.h1
          className="text-xl font-extrabold tracking-tight text-white drop-shadow-md"
          whileHover={{ scale: 1.05 }}
        >
          EchoTune
        </motion.h1>
      </motion.div>
    </Link>
  );
};

export default Logo;
