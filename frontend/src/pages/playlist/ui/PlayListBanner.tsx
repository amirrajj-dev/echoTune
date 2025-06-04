import { motion } from "framer-motion";
import { Music, Flame } from "lucide-react";

interface PlaylistBannerProps {
  playlistName?: string;
}

const PlaylistBanner = ({ playlistName }: PlaylistBannerProps) => {
  return (
    <div className="relative mb-8">
      <motion.div
        className={`w-full flex flex-col gap-4 h-64 bg-gradient-to-br ${
          playlistName?.toLowerCase()?.includes("fire")
            ? "from-accent to-success"
            : "from-primary to-secondary"
        } flex items-center justify-center rounded-lg shadow-lg`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-base-300 capitalize font-semibold text-3xl">
          {playlistName}
        </span>
        <span>
          {playlistName?.includes("fire") ? (
            <Flame className="size-12 text-base-100" />
          ) : (
            <Music className="size-12 text-base-100" />
          )}
        </span>
      </motion.div>
    </div>
  );
};

export default PlaylistBanner;