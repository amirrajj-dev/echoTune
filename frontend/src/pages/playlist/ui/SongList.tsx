import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import MusicCard from "../../../components/ui/MusicCard";
import type { IPlayList, ISong } from '../../../interfaces/interfaces'

interface SongListProps {
  playlist?: IPlayList;
  isPlaylistLoading: boolean;
  currentSong?: ISong;
  isPlaying: boolean;
  handlePlayPause: (song: ISong) => void;
}

const SongList = ({
  playlist,
  isPlaylistLoading,
  currentSong,
  isPlaying,
  handlePlayPause,
}: SongListProps) => {
  return (
    <>
      {isPlaylistLoading ? (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 bg-base-200 border rounded-xl shadow-xl border-white/10 gap-6 animate-pulse p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-base-300 rounded-xl skeleton" />
          ))}
        </div>
      ) : !playlist || playlist?.songs?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-base-200 rounded-lg"
        >
          <Music className="w-16 h-16 text-primary mx-auto mb-4" />
          <p className="text-lg text-base-content/70">
            No songs in this playlist.
          </p>
          <p className="text-sm text-base-content/60">
            Add songs from your favorites to get started! 🎵
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 bg-base-200 backdrop-blur-lg max-h-[500px] overflow-y-scroll rounded-xl shadow-xl border border-white/10"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {playlist?.songs?.map((song) => (
              <motion.div
                key={song._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3 }}
              >
                <MusicCard
                  song={song as ISong}
                  isPlaying={song._id === currentSong?._id && isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default SongList;