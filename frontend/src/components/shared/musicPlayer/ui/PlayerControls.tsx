import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCw,
  RotateCcw,
  Shuffle,
  Heart,
  ListMusic,
  Repeat1,
  Repeat,
} from "lucide-react";
import { useMusic } from "../../../../store/music.store";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../configs/axios";

interface PlayerControlsProps {
  isInTheUserFavouriteSongs: boolean;
  isPending: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
  playListButtonRef: React.RefObject<HTMLButtonElement>;
}

const PlayerControls = ({
  isInTheUserFavouriteSongs,
  isPending,
  isDropdownOpen,
  setIsDropdownOpen,
  playListButtonRef,
}: PlayerControlsProps) => {
  const {
    isPlaying,
    isRepeat,
    isRepeatLoop,
    isShuffle,
    playSong,
    pauseSong,
    previousSong,
    nextSong,
    seekBackward,
    seekForward,
    toggleShuffle,
    toggleRepeat,
    toggleRepeatLoop,
    setIsShowMusicPlayer,
    currentSong,
  } = useMusic();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const getRepeatIcon = () => {
    if (isRepeat) return <Repeat1 className="w-4 h-4" />;
    if (isRepeatLoop) return <Repeat className="w-4 h-4" />;
    return <Repeat className="w-4 h-4 opacity-50" />;
  };

  const cycleRepeatMode = () => {
    if (isRepeat) {
      toggleRepeat();
      toggleRepeatLoop();
    } else if (isRepeatLoop) {
      toggleRepeatLoop();
    } else {
      toggleRepeat();
    }
  };

  const { mutate: AddToFavouriteSongs, isPending: isPendingAddToPlaylist } =
    useMutation({
      mutationFn: async (songId: string) => {
        const { data } = await axiosInstance.put(`/users/favourites/${songId}`);
        return data;
      },
      onSuccess: (res) => {
        if (res.message === "Song Removed From Favourite Songs") {
          toast.success("Song removed from favourites successfully");
          setIsShowMusicPlayer(false);
          pauseSong();
        } else {
          toast.success("Song added to favourites successfully");
        }
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
      },
      onError: (e) => {
        console.log(e);
        toast.error(e.message || "Error adding song to favourites");
      },
    });

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-1 overflow-x-auto sm:overflow-x-visible scrollbar-hide snap-x snap-mandatory">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={cycleRepeatMode}
        className={`p-2 rounded-full tooltip transition-colors cursor-pointer snap-center ${
          isRepeat || isRepeatLoop
            ? "bg-success/20 text-success"
            : "text-base-content/60 hover:text-success"
        }`}
        data-tip={
          isRepeat ? "Repeat One" : isRepeatLoop ? "Repeat All" : "Repeat Off"
        }
      >
        {getRepeatIcon()}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={previousSong}
        className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50 snap-center"
        data-tip="Previous"
      >
        <SkipBack className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={seekBackward}
        className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50 snap-center"
        data-tip="-10 sec"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={isPlaying ? pauseSong : playSong}
        className="p-3 rounded-full tooltip cursor-pointer bg-gradient-to-r from-primary to-secondary text-base-100 shadow-lg snap-center"
        data-tip={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={seekForward}
        className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50 snap-center"
        data-tip="+10 sec"
      >
        <RotateCw className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSong}
        className="p-2 tooltip rounded-full cursor-pointer text-base-content/60 hover:text-base-content bg-base-200/50 snap-center"
        data-tip="Next"
      >
        <SkipForward className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleShuffle}
        className={`p-2 tooltip rounded-full transition-colors cursor-pointer snap-center ${
          isShuffle
            ? "bg-accent/20 text-accent"
            : "text-base-content/60 hover:text-accent"
        }`}
        data-tip={isShuffle ? "Shuffle Off" : "Shuffle On"}
      >
        <Shuffle className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 tooltip rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed snap-center`}
        data-tip={
          isInTheUserFavouriteSongs
            ? "Remove From Favourites"
            : "Add To Favourites"
        }
        onClick={() => AddToFavouriteSongs(currentSong?._id as string)}
        disabled={isPendingAddToPlaylist}
      >
        <Heart className="w-4 h-4" />
      </motion.button>

      {isSignedIn && (
        <motion.button
          ref={playListButtonRef}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 tooltip rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed snap-center`}
          data-tip="Add To Playlist"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isPending}
        >
          <ListMusic className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};

export default PlayerControls;