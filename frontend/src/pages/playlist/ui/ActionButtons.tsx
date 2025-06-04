import { motion } from "framer-motion";
import { Play, Pause, Edit, Trash, ArrowUpDown, Loader2 } from "lucide-react";
import type { IPlayList } from "../../../interfaces/interfaces";

interface ActionButtonsProps {
  playlist?: IPlayList;
  isPlaying: boolean;
  isPendingDeletePlayList: boolean;
  isShowMusicPlayer: boolean;
  setIsEditModalOpen: (value: boolean) => void;
  setIsAddSongModalOpen: (value: boolean) => void;
  setIsShowMusicPlayer: (value: boolean) => void;
  handlePlayPauseAlbum: () => void;
  deletePlayList: () => void;
  setNewName: (name: string) => void;
}

const ActionButtons = ({
  playlist,
  isPlaying,
  isPendingDeletePlayList,
  isShowMusicPlayer,
  setIsEditModalOpen,
  setIsAddSongModalOpen,
  setIsShowMusicPlayer,
  handlePlayPauseAlbum,
  deletePlayList,
  setNewName,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col mb-6 p-4 sm:flex-row justify-center items-center gap-4 bg-base-200 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-soft btn-primary tooltip gap-2 w-full sm:w-auto"
        onClick={() => setIsAddSongModalOpen(true)}
        data-tip="Delete From Playlist"
      >
        <Trash className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-soft btn-success tooltip w-full sm:w-auto"
        disabled={!playlist?.songs?.length}
        data-tip="Play"
        onClick={handlePlayPauseAlbum}
      >
        {isPlaying ? (
          <Pause className="size-5" />
        ) : (
          <Play className="size-5" />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-soft btn-accent tooltip w-full sm:w-auto"
        onClick={() => {
          setNewName(playlist?.name || "");
          setIsEditModalOpen(true);
        }}
        data-tip="Rename Playlist"
      >
        <Edit className="w-5 h-5" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-soft btn-error tooltip w-full sm:w-auto"
        onClick={deletePlayList}
        disabled={isPendingDeletePlayList}
        data-tip="Delete Playlist"
      >
        {isPendingDeletePlayList ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Trash className="w-5 h-5" />
        )}
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="btn btn-soft btn-secondary tooltip w-full sm:w-auto"
        onClick={() => setIsShowMusicPlayer(!isShowMusicPlayer)}
        disabled={isPendingDeletePlayList}
        data-tip={isShowMusicPlayer ? "Hide Music Player" : "Show Music Player"}
      >
        <ArrowUpDown className="size-5" />
      </motion.button>
    </div>
  );
};

export default ActionButtons;