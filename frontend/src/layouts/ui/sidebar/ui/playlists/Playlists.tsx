import { Library, Music2 } from "lucide-react";
import PlayListItem from "./ui/PlayListItem";
import { motion } from "framer-motion";
import PlaylistsSkeleton from "../../../../../components/ui/skeletons/PlayListSkeleton";
import { Link } from "react-router-dom";
import { useAlbums } from "../../../../../hooks/album.hook";

const Playlists = () => {
  const { data: albums, isLoading } = useAlbums();

  return (
    <motion.div
      className="flex flex-col gap-4 bg-base-300 backdrop-blur-md p-4 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2
        className="flex items-center gap-3 text-lg font-semibold text-base-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Library size={20} />
        Playlists
      </motion.h2>

      <div className="max-h-[300px] md:max-h-[400px] overflow-y-auto flex flex-col gap-2">
        {isLoading ? (
          <PlaylistsSkeleton />
        ) : albums && albums?.length > 0 ? (
          albums?.map(({ artist, songs, title, imageUrl, _id }, index) => (
            <Link to={`/albums/${_id}`} key={_id}>
              <PlayListItem
                albumUrl={imageUrl}
                artistName={artist}
                songCount={songs.length}
                title={title}
                key={index}
                delay={0.3 + index * 0.1}
              />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-2 py-10 text-base-content/70">
            <Music2 size={32} className="opacity-40 text-secondary" />
            <h3 className="text-md font-semibold">No playlists yet</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Playlists;
