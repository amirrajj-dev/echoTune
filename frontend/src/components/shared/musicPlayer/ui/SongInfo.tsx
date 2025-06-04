import { motion } from "framer-motion";
import { Music2 } from "lucide-react";
import type { ISong } from "../../../../interfaces/interfaces";

interface SongInfoProps {
  currentSong: ISong;
}

const SongInfo = ({ currentSong }: SongInfoProps) => {
  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <motion.div whileHover={{ scale: 1.05 }} className="relative">
        {currentSong.imageUrl ? (
          <img
            src={currentSong.imageUrl}
            alt="cover"
            className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl shadow-lg border border-base-content/10"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
            <Music2 className="w-8 h-8 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-content/30 to-transparent rounded-xl" />
      </motion.div>
      <div className="flex-1 min-w-0">
        <motion.div
          className="text-base sm:text-lg font-semibold text-base-content truncate"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentSong.title}
        </motion.div>
        <div className="text-sm text-base-content/60 truncate">
          {currentSong.artist}
        </div>
      </div>
    </div>
  );
};

export default SongInfo;