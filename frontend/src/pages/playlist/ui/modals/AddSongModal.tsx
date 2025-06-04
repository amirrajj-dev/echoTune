import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type { IPlayList } from "../../../../interfaces/interfaces";

interface AddSongModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  playlist?: IPlayList;
  isPlaylistLoading: boolean;
  isPending: boolean;
  handleRemoveSong: (songId: string) => void;
}

const AddSongModal = ({
  isOpen,
  setIsOpen,
  playlist,
  isPlaylistLoading,
  isPending,
  handleRemoveSong,
}: AddSongModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="bg-base-100 rounded-lg p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Delete Song From PlayList</h2>
              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {isPlaylistLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-12 h-12 bg-base-300 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-base-300 rounded w-3/4" />
                      <div className="h-3 bg-base-300 rounded w-1/2 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : playlist?.songs.length === 0 ? (
              <p className="text-center text-base-content/70">
                No songs yet to delete :)
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {playlist?.songs?.map((song) => (
                  <motion.div
                    key={song._id}
                    className="flex items-center gap-4 hover:bg-base-200 p-2 rounded"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={song.imageUrl || "/placeholder.png"}
                      alt={song.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{song.title}</p>
                      <p className="text-xs text-base-content/70">
                        {song.artist}
                      </p>
                    </div>
                    <button
                      className={`btn btn-sm btn-error`}
                      onClick={() => handleRemoveSong(song._id)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSongModal;