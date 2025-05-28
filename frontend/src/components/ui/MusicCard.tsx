import { Play, Pause, Music2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ISong } from "../../interfaces/interfaces";

interface Props {
  song: ISong;
  isPlaying: boolean;
  onPlayPause: (song: ISong) => void;
}

const MusicCard = ({ song, isPlaying, onPlayPause }: Props) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative flex items-center gap-4 p-4 rounded-2xl bg-base-300 hover:shadow-2xl transition-all w-full h-full group border border-white/5"
    >
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="w-full h-full object-cover"
        />

        {/* Hover play/pause button */}
        <motion.button
          onClick={() => onPlayPause(song)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 18,
              duration: 0.3,
            }}
            className="btn btn-circle btn-sm bg-gradient-to-br from-primary to-secondary text-white border-none shadow-md"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.div>
        </motion.button>

        {/* Playing icon */}
        {isPlaying && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              ease: "linear",
            }}
            className="absolute top-1 right-1 bg-gradient-to-br from-primary to-secondary text-white p-1 rounded-full shadow-md group-hover:opacity-0 transition-opacity"
          >
            <Music2 size={14} />
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-sm font-semibold truncate text-base-content">
          {song.title}
        </h3>
        <p className="text-xs text-base-content/70 truncate">{song.artist}</p>
      </div>
    </motion.div>
  );
};

export default MusicCard;