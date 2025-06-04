import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { Link } from "react-router-dom";
import PlaylistCard from "../../../components/ui/PlayListCard";
import type { IPlayList } from "../../../interfaces/interfaces";

interface PlaylistsListProps {
  playlists?: IPlayList[];
  isLoading: boolean;
}

const PlaylistsList = ({ playlists, isLoading }: PlaylistsListProps) => {
  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card bg-base-200 shadow-xl animate-pulse">
              <div className="w-full h-48 bg-base-300" />
              <div className="card-body p-4">
                <div className="h-6 bg-base-300 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : playlists?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-base-200 rounded-lg border border-white/10"
        >
          <Music className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-lg text-base-content/70">No playlists yet.</p>
          <p className="text-sm text-base-content/60">
            Create your first playlist to get started! 🎵
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl max-h-[500px] overflow-y-scroll border border-white/10"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {playlists?.map((playlist) => (
              <motion.div
                key={playlist._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/playlists/${playlist._id}`}>
                  <PlaylistCard playlist={playlist} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default PlaylistsList;