import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { axiosInstance } from "../../../configs/axios";
import type { IAlbum, ISong } from "../../../interfaces/interfaces";
import VerticalMusicCard from "../../../components/ui/VerticalMusicCard";
import { useMusic } from "../../../store/music.store";

interface TrendingSongsResponse {
  data: ISong[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const TrendingSongs = () => {
  const { currentSong, setCurrentSong, isPlaying, playSong, pauseSong , setIsShowMusicPlayer } =
    useMusic();
  const { data: trendingSongs = [], isLoading } = useQuery({
    queryKey: ["trendingSongs"],
    queryFn: async () => {
      const res = await axiosInstance.get<TrendingSongsResponse>(
        "/songs/trending"
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
        const virtualAlbum: IAlbum = {
          _id: "trending-virtual-album",
          title: "Trending songs",
          artist: "Various Artists",
          imageUrl: "",
          releaseYear: new Date().getFullYear(),
          songs: trendingSongs,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCurrentSong(song, virtualAlbum);
      }
    };

  return (
    <div className="space-y-6 bg-base-100/60 backdrop-blur-md border border-white/10 p-6 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold">Trending Songs</h2>

      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
         {Array.from({ length: 4 }).map((_, i) => (
           <div key={i} className="h-56 bg-base-300 rounded-xl skeleton" />
         ))}
       </div>
      ) : (
        <motion.div
          className="grid max-h-[400px] overflow-y-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {trendingSongs.length > 0 ? trendingSongs.map((song) => (
              <motion.div
                key={song._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <VerticalMusicCard
                  song={song}
                  isPlaying={currentSong?._id === song._id && isPlaying}
                  onPlayPause={handlePlayPause}
                />
              </motion.div>
            )) : (
              <p className="text-center text-nowrap text-lg">No trending songs found.</p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default TrendingSongs;
