import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import VerticalMusicCard from "../../components/ui/VerticalMusicCard";
import Logo from "../../components/ui/Logo";
import type { IAlbum, ISong } from "../../interfaces/interfaces";
import { useMusic } from "../../store/music.store";
import { useFavourites } from "../../hooks/favourite.hook";
import { Music2 } from "lucide-react";
import MusicPlayer from "../../components/shared/musicPlayer/MusicPlayer";

const FavouritesPage = () => {
  const { user, isSignedIn } = useUser();
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    playSong,
    pauseSong,
    setIsShowMusicPlayer,
  } = useMusic();

  const { data: favouriteSongs, isLoading } = useFavourites(
    user?.id as string,
    isSignedIn as boolean
  );

  const handlePlayPause = (song: ISong) => {
    setIsShowMusicPlayer(true);
    if (currentSong?._id === song._id && isPlaying) {
      pauseSong();
    } else if (currentSong?._id === song._id && !isPlaying) {
      playSong();
    } else {
      const virtualAlbum: IAlbum = {
        _id: "made-for-you-virtual-album",
        title: "Made For You",
        artist: "Various Artists",
        imageUrl: "",
        releaseYear: new Date().getFullYear(),
        songs: favouriteSongs as ISong[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentSong(song, virtualAlbum);
    }
  };

  if (!isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-base-100"
      >
        <div className="text-center space-y-4">
          <Logo />
          <h2 className="text-2xl font-semibold text-base-content">
            Please sign in to view your favorites
          </h2>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8"
    >
      <header className="mb-8 flex items-center justify-between">
        <Logo />
        <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
          Your Favorite Songs
        </h1>
      </header>

      <main>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-base-300 h-96 rounded-xl skeleton"
              />
            ))}
          </div>
        ) : favouriteSongs?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-base-200 rounded-lg"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-3 rounded-full">
                <Music2 />
              </div>
              <p className="text-lg text-base-content/70">
                No favorite songs yet.
              </p>
              <p className="text-sm text-base-content/60">
                Add songs to your favorites to see them here! 🎶
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {favouriteSongs?.map((song) => (
                <motion.div
                  key={song._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <VerticalMusicCard
                    song={song}
                    isPlaying={currentSong?._id === song._id && isPlaying}
                    onPlayPause={handlePlayPause}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <MusicPlayer />
    </motion.div>
  );
};

export default FavouritesPage;
