import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  playlistName: string;
  setPlaylistName: (value: string) => void;
  isPending: boolean;
  handleCreatePlaylist: () => void;
}

const CreatePlaylistModal = ({
  isOpen,
  setIsOpen,
  playlistName,
  setPlaylistName,
  isPending,
  handleCreatePlaylist,
}: CreatePlaylistModalProps) => {
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
            className="bg-base-100 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Create New Playlist</h2>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="input input-bordered w-full mb-4"
              minLength={4}
              maxLength={100}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setIsOpen(false);
                  setPlaylistName("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreatePlaylist}
                disabled={isPending || playlistName.trim().length < 4}
              >
                {isPending ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePlaylistModal;