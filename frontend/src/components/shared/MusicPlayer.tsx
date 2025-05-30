import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useMusic } from "../../store/music.store";

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
    isShowMusicPlayer
  } = useMusic();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);

  const formatTime = (time: number) =>
    new Date(time * 1000).toISOString().substring(14, 19);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setBuffered(audio.buffered?.end(0) || 0);
    };
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(0));
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("progress", handleProgress);

    // Initialize duration and buffered state if audio is already loaded
    if (audio.duration) {
      setDuration(audio.duration);
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(0));
      }
    }

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("progress", handleProgress);
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
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
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
                  className={`p-2 tooltip rounded-full transition-colors cursor-pointer`}
                  data-tip={"Add To Favourite"}
                >
                  <Heart className="w-4 h-4" />
                </motion.button>
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
