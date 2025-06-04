import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMusic } from "../../../store/music.store";
import { useChatStore } from "../../../store/chat.store";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../configs/axios";
import { toast } from "sonner";
import { useFavourites } from "../../../hooks/favourite.hook";
import type { IPlayList } from "../../../interfaces/interfaces";
import SongInfo from "./ui/SongInfo";
import PlayerControls from "./ui/PlayerControls";
import VolumeControl from "./ui/VolumeControls";
import SeekControl from "./ui/SeekControl";
import PlaylistDropdown from "./ui/PlayListDropdown";

const MusicPlayer = () => {
  const {
    currentSong,
    audio,
    isPlaying,
    isShowMusicPlayer,
  } = useMusic();
  const { socket } = useChatStore();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { isSignedIn } = useAuth();
  const { data: userFavouriteSongs } = useFavourites(
    user?.id as string,
    isSignedIn as boolean
  );
  const isInTheUserFavouriteSongs = userFavouriteSongs?.some((s) =>
    s._id.includes(currentSong?._id as string)
  );

  useEffect(() => {
    if (!socket || !user?.id) return;
    if (isPlaying && currentSong) {
      socket.emit("update_activity", {
        userId: user.id,
        activity: "Listening",
        song: { name: currentSong.title, artist: currentSong.artist },
      });
    } else {
      socket.emit("update_activity", {
        userId: user.id,
        activity: "Idle",
      });
    }
  }, [isPlaying, currentSong, socket, user?.id]);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    if (audio.duration) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audio, currentSong]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { mutate: addToPlaylist, isPending } = useMutation({
    mutationFn: async (playlistId: string) => {
      const { data } = await axiosInstance.put(`/playlists/${playlistId}`, {
        songId: currentSong?._id,
      });
      return data.data as IPlayList;
    },
    onSuccess: (playlist : IPlayList) => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlist._id] });
      setIsDropdownOpen(false);
      toast.success(`Added "${currentSong?.title}" to ${playlist.name} playlist`);
    },
    onError: () => {
      toast.error("Error adding song to playlist");
    },
  });

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId);
  };

  const playListDropDownRef = useRef<HTMLDivElement | null>(null);
  const playListButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleClickOutSide = useCallback(
    (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        !playListDropDownRef.current?.contains(event.target as Node) &&
        !playListButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    },
    [isDropdownOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, [handleClickOutSide]);

  return (
    <AnimatePresence>
      {currentSong && isShowMusicPlayer && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[999] bg-base-300 backdrop-blur-xl border-t border-base-content/10 p-4 shadow-2xl sm:p-6"
        >
          <div className="max-w-full mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
            <SongInfo currentSong={currentSong} />
            <div className="flex flex-wrap gap-4 md:gap-12 lg:gap-16">
              <div className="relative">
                <PlayerControls
                  isInTheUserFavouriteSongs={isInTheUserFavouriteSongs as boolean}
                  isPending={isPending}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  playListButtonRef={playListButtonRef as RefObject<HTMLButtonElement>}
                />
                <PlaylistDropdown
                  isDropdownOpen={isDropdownOpen}
                  playListDropDownRef={playListDropDownRef as RefObject<HTMLDivElement>}
                  setIsDropdownOpen={setIsDropdownOpen}
                  handleAddToPlaylist={handleAddToPlaylist}
                  isPending={isPending}
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 justify-end">
                <VolumeControl />
                <SeekControl
                  currentTime={currentTime}
                  duration={duration}
                  setCurrentTime={setCurrentTime}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;