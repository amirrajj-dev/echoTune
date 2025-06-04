import { motion } from "framer-motion";
import { Flame, Music } from "lucide-react";

interface Playlist {
  _id: string;
  name: string;
  songs: Array<{ _id: string; imageUrl?: string }>;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="card bg-base-100 shadow-lg overflow-hidden cursor-pointer"
    >
      <div>
        <div className={`w-full h-48 bg-gradient-to-br ${playlist.name.toLowerCase().includes('fire') || playlist.name.toLowerCase().includes('top') ? "from-accent to-success" : "from-primary to-secondary"} flex items-center justify-center`}>
          {playlist.name.includes('fire') ? (<Flame className="size-12 text-base-100" />) : (
            <Music className="size-12 text-base-100" />
          )}
        </div>
      </div>
      <div className="card-body p-4">
        <h3 className="card-title text-base font-semibold truncate">
          {playlist.name}
        </h3>
        <p className="text-sm text-base-content/70">
          {playlist.songs.length} song{playlist.songs.length !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
