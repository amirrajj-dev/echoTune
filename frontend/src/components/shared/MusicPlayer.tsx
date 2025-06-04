import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  SkipForward,
  SkipBack,
  Repeat,
  Repeat1,
  Shuffle,
  Music2,
  RotateCw,
  RotateCcw,
  Heart,
  ListMusic,
  Loader2,
} from "lucide-react";
import { useMusic } from "../../store/music.store";
import { useChatStore } from "../../store/chat.store";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axios";
import { toast } from "sonner";
import { useFavourites } from "../../hooks/favourite.hook";
import type { IPlayList } from "../../interfaces/interfaces";
import { usePlayLists } from "../../hooks/playlists.hook";

const MusicPlayer = () => {
  const {
    currentSong,
    audio,
    isPlaying,
    playSong,
    pauseSong,
    nextSong,
    previousSong,
    isRepeat,
    isRepeatLoop,
    isShuffle,
    toggleRepeat,
    toggleRepeatLoop,
    toggleShuffle,
    volume,
    setVolume,
    seekTo,
    seekBackward,
    seekForward,
    isShowMusicPlayer,
    setIsShowMusicPlayer,
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

  const formatTime = (time: number) =>
    new Date(time * 1000).toISOString().substring(14, 19);
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

    // Initialize duration
    if (audio.duration) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audio, currentSong]);

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  const cycleRepeatMode = () => {
    if (isRepeat) {
      toggleRepeat(); // off repeat
      toggleRepeatLoop(); // on loop
    } else if (isRepeatLoop) {
      toggleRepeatLoop(); // off loop
    } else {
      toggleRepeat(); // on repeat
    }
  };

  const getRepeatIcon = () => {
    if (isRepeat) return <Repeat1 className="w-4 h-4" />;
    if (isRepeatLoop) return <Repeat className="w-4 h-4" />;
    return <Repeat className="w-4 h-4 opacity-50" />;
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: playlists, isLoading: isPlaylistsLoading } = usePlayLists(
    isSignedIn as boolean
  );

  const { mutate: addToPlaylist, isPending } = useMutation({
    mutationFn: async (playlistId: string) => {
      const { data } = await axiosInstance.put(`/playlists/${playlistId}`, {
        songId: currentSong?._id,
      });
      return data.data as IPlayList;
    },
    onSuccess: (data, playlistId) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      setIsDropdownOpen(false);
      toast.success(`Added "${currentSong?.title}" to playlist`);
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

    const handleClickOutSide = useCallback((event : MouseEvent) => {
      if (
        isDropdownOpen &&
        !playListDropDownRef.current?.contains(event.target as Node) &&
        !playListButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    } , [isDropdownOpen])

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
            {/* Song Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                {currentSong.imageUrl ? (
                  <img
                    src={currentSong.imageUrl}
                    alt="cover"
                    className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl shadow-lg border border-base-content/10"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                    <Music2 className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-base-content/30 to-transparent rounded-xl" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.div
                  className="text-base sm:text-lg font-semibold text-base-content truncate"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentSong.title}
                </motion.div>
                <div className="text-sm text-base-content/60 truncate">
                  {currentSong.artist}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 md:gap-12 lg:gap-16">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={cycleRepeatMode}
                  className={`p-2 rounded-full tooltip transition-colors cursor-pointer ${
                    isRepeat || isRepeatLoop
                      ? "bg-success/20 text-success"
                      : "text-base-content/60 hover:text-success"
                  }`}
                  data-tip={
                    isRepeat
                      ? "Repeat One"
                      : isRepeatLoop
                      ? "Repeat All"
                      : "Repeat Off"
                  }
                >
                  {getRepeatIcon()}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={previousSong}
                  className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50"
                  data-tip="Previous"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={seekBackward}
                  className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50"
                  data-tip="-10 sec"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={isPlaying ? pauseSong : playSong}
                  className="p-3 rounded-full tooltip cursor-pointer bg-gradient-to-r from-primary to-secondary text-base-100 shadow-lg"
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
                  className="p-2 rounded-full cursor-pointer tooltip text-base-content/60 hover:text-base-content bg-base-200/50"
                  data-tip="+10 sec"
                >
                  <RotateCw className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextSong}
                  className="p-2 tooltip rounded-full cursor-pointer text-base-content/60 hover:text-base-content bg-base-200/50"
                  data-tip="Next"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleShuffle}
                  className={`p-2 tooltip rounded-full transition-colors cursor-pointer ${
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
                  className={`p-2 tooltip rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                  data-tip={
                    isInTheUserFavouriteSongs
                      ? "Remove From Favourites"
                      : "Add To Favourites"
                  }
                  onClick={() => AddToFavouriteSongs(currentSong._id)}
                  disabled={isPending}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
                {isSignedIn && (
                  <div className="relative">
                    <motion.button
                      ref={playListButtonRef}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 tooltip rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      data-tip={
                       "Add To Playlist"
                      }
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={isPending}
                    >
                      <ListMusic className="w-4 h-4" />
                    </motion.button>
                    {isDropdownOpen && (
                      <motion.div
                        ref={playListDropDownRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-10 right-4 md:left-4 bg-base-100 w-56 rounded-xl"
                      >
                        <h2 className="border-b border-base-content/50 p-2 bg-gradient-to-br from-primary to-secondary rounded-t-xl">
                          Add To PlayList
                        </h2>
                        <ul className="flex flex-col gap-2">
                          {isPlaylistsLoading ? (
                            <motion.li
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                              }}
                              className="p-2"
                            >
                              <span className="animate-pulse">Loading ...</span>
                            </motion.li>
                          ) : playlists?.length === 0 ? (
                            <motion.li
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.2,
                              }}
                              className="p-2"
                            >
                              <span className="text-base-content/70 text-sm text-center">
                                No playlists available :(
                              </span>
                            </motion.li>
                          ) : (
                            playlists?.map((playlist) =>{
                              const alreadyInPlayList = playlist.songs.some(p=>p.title === currentSong.title)
                              return (
                                <motion.li
                                key={playlist._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: 0.05 * playlists.indexOf(playlist),
                                }}
                                className="hover:bg-gradient-to-br hover:from-primary hover:to-secondary hover:text-base-100"
                                onClick={() =>
                                  handleAddToPlaylist(playlist._id)
                                }
                              >
                                <button disabled={isPendingAddToPlaylist || alreadyInPlayList} className="w-full h-full cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50 p-2">
                                  <span>{isPending ? <Loader2 className="size-4 animate-spin" /> : playlist.name}</span>
                                  {alreadyInPlayList && (
                                    <span className="badge badge-primary badge-xs ml-2">
                                      Added
                                    </span>
                                  )}
                                </button>
                              </motion.li>
                              )
                            })
                          )}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {/* Volume & Seek */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 justify-end">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                    className="text-base-content/60 cursor-pointer hover:text-base-content"
                  >
                    {getVolumeIcon()}
                  </motion.button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 sm:w-24 h-1 bg-base-200 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs text-base-content/60 w-full sm:w-64">
                  <span>{formatTime(currentTime)}</span>
                  <div className="relative w-full">
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        setCurrentTime(time);
                        seekTo(time);
                      }}
                      className="w-full h-1 bg-base-200 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 h-1 bg-primary/50 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentTime / duration) * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MusicPlayer;
