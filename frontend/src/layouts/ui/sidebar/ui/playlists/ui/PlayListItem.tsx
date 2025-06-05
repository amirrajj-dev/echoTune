import { motion } from "framer-motion";

interface PlayListItemProps {
  delay?: number;
  albumUrl : string;
  title: string;
  songCount: number;
  artistName: string;
}

const PlayListItem = ({ delay = 0 , albumUrl , title, songCount, artistName }: PlayListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
    >
      <img
        className="size-14 rounded-md object-cover shadow-sm"
        src={albumUrl}
        alt="playlist"
      />
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-base-content">{title}</span>
        <span className="text-xs text-base-content/60">{songCount} songs</span>
        <span className="text-xs text-base-content/60">
          by <span className="font-semibold">{artistName}</span>
        </span>
      </div>
    </motion.div>
  );
};

export default PlayListItem;