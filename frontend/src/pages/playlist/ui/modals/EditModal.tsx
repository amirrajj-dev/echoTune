import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  newName: string;
  setNewName: (value: string) => void;
  isPending: boolean;
  handleRename: () => void;
}

const EditModal = ({
  isOpen,
  setIsOpen,
  newName,
  setNewName,
  isPending,
  handleRename,
}: EditModalProps) => {
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
            <h2 className="text-xl font-bold mb-4">Rename Playlist</h2>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
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
                  setNewName("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRename}
                disabled={isPending || newName.trim().length < 4}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditModal;