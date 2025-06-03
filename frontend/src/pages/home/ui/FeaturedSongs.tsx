import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../configs/axios";
import type { IAlbum, ISong } from "../../../interfaces/interfaces";
import MusicCard from "../../../components/ui/MusicCard";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "../../../store/music.store";

interface FeaturedSongsResponse {
  data: ISong[];
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const FeaturedSongs = () => {
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    playSong,
    pauseSong,
    setIsShowMusicPlayer
  } = useMusic();
  const { data: featuredSongs = [], isLoading } = useQuery({
    queryKey: ["featuredSongs"],
    queryFn: async () => {
      const res = await axiosInstance.get<FeaturedSongsResponse>(
        "/songs/featured"
      );
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const handlePlayPause = (song: ISong) => {
    setIsShowMusicPlayer(true)
    if (currentSong?._id === song._id && isPlaying) {
      pauseSong();
    } else if (currentSong?._id === song._id && !isPlaying) {
      playSong();
    } else {
      // Create a virtual album for featured songs
      const virtualAlbum: IAlbum = {
        _id: "featured-songs-virtual-album",
        title: "Featured Songs",
        artist: "Various Artists",
        imageUrl: "",
        releaseYear: new Date().getFullYear(),
        songs: featuredSongs,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentSong(song, virtualAlbum);
    }
  };

  return (
    <div className="space-y-6 bg-base-100/60 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold">{getGreeting()}</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-base-300 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid max-h-[400px] overflow-y-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {featuredSongs.length > 0 ? featuredSongs.map((song) => (
              <motion.div
                key={song._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <MusicCard
                  song={song}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </motion.div>
            )) : (
              <p className="text-center text-lg">No featured songs found.</p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FeaturedSongs;
