import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "../../store/music.store";
import type { IAlbum } from "../../interfaces/interfaces";
import { Play, Pause, Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import MainAlbumSkeleton from "../../components/ui/skeletons/MainAlbumSkeleton";
import MusicPlayer from "../../components/shared/MusicPlayer";

interface AlbumResponse {
  data: IAlbum;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
};

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: album, isLoading } = useQuery({
    queryKey: ["album", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AlbumResponse>(`/albums/${id}`);
      return data.data;
    },
  });

  const {
    currentSong,
    setCurrentSong,
    setCurrentAlbum,
    isPlaying,
    playSong,
    pauseSong,
    setIsShowMusicPlayer
  } = useMusic();

  useEffect(() => {
    if (album) {
      setCurrentAlbum(album);
    }
  }, [album, setCurrentAlbum]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePlayPauseAlbum = () => {
    if (album && album.songs.length > 0 && !isPlaying) {
      setIsShowMusicPlayer(true)
      if (currentSong) {
        playSong();
      } else {
        setCurrentSong(album.songs[0]);
        playSong();
      }
    } else {
      pauseSong();
    }
  };

  const handlePlaySong = (songId: string) => {
    const song = album?.songs.find((s) => s._id === songId);
    if (!song) return;
    setIsShowMusicPlayer(true)
    if (currentSong?._id === song._id) {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    } else {
      setCurrentSong(song);
    }
  };

  if (isLoading || !album) {
    return <MainAlbumSkeleton />;
  }

  return (
    <>
      <div className="p-6 space-y-6 bg-base-100/60 backdrop-blur-lg rounded-xl shadow-xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-base-300 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-md"
        >
          <img
            src={album.imageUrl}
            alt={album.title}
            className="w-40 h-40 rounded-xl object-cover shadow-lg"
          />
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl font-bold text-base-content">
              {album.title}
            </h1>
            <p className="text-base-content/80 text-sm">
              By <span className="font-medium">{album.artist}</span> •{" "}
              {album.releaseYear}
            </p>
            <p className="text-base-content/60 text-sm">
              {album.songs.length} {album.songs.length === 1 ? "song" : "songs"}
            </p>
            <button
              onClick={handlePlayPauseAlbum}
              className="btn btn-soft bg-gradient-to-br from-primary to-secondary btn-circle mt-2 btn-lg self-center md:self-start gap-2"
            >
              {isPlaying ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Songs Table */}
        <motion.div
          className="overflow-auto max-h-[400px] bg-base-300 p-4 rounded-xl shadow border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <table className="table bg-base-300 text-base-content">
            <thead className="bg-base-100 sticky -top-4 z-10">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Release Date</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {album.songs.map((song, index) => {
                const isHovered = hoveredIndex === index;
                const isCurrent = currentSong?._id === song._id;

                return (
                  <tr
                    key={song._id}
                    onClick={() => handlePlaySong(song._id)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group cursor-pointer hover:bg-base-200 transition rounded-lg ${
                      isCurrent ? "bg-base-100" : ""
                    }`}
                  >
                    <td className="w-10 text-center">
                      <AnimatePresence mode="wait">
                        {isHovered ? (
                          <motion.div
                            key="hover"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            {isCurrent && isPlaying ? (
                              <Pause size={18} className="text-warning" />
                            ) : (
                              <Play size={18} className="text-primary" />
                            )}
                          </motion.div>
                        ) : isCurrent && isPlaying ? (
                          <motion.div
                            key="playing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Music2
                              className="text-success animate-pulse"
                              size={18}
                            />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="index"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-base-content/70"
                          >
                            {index + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </td>

                    <td className="flex items-center gap-3 py-2">
                      <img
                        src={song.imageUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded-md object-cover shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{song.title}</span>
                        <span className="text-xs text-base-content/50">
                          {song.artist}
                        </span>
                      </div>
                    </td>

                    <td className="text-sm text-base-content/80">
                      {new Date(song.createdAt).toLocaleDateString()}
                    </td>

                    <td className="text-sm text-base-content/80">
                      {formatDuration(song.duration)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>
        <MusicPlayer />
    </>
  );
};

export default AlbumPage;
