import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import { useMusic } from "../../../../store/music.store";
import { usePlayLists } from "../../../../hooks/playlists.hook";

interface PlaylistDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isDropdownOpen: boolean) => void;
  playListDropDownRef: React.RefObject<HTMLDivElement>;
  handleAddToPlaylist: (playlistId: string) => void;
  isPending : boolean
}

const PlaylistDropdown = ({
  isDropdownOpen,
  playListDropDownRef,
  handleAddToPlaylist,
  isPending
}: PlaylistDropdownProps) => {
  const { isSignedIn } = useAuth();
  const { currentSong } = useMusic();
  const { data: playlists, isLoading: isPlaylistsLoading } = usePlayLists(
    isSignedIn as boolean
  );

  return (
    <>
      {isSignedIn && isDropdownOpen && (
        <motion.div
          ref={playListDropDownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-[-80px] left-28 sm:left-42 bg-base-100 w-56 rounded-xl shadow-lg z-10"
        >
          <h2 className="border-b border-base-content/50 p-2 bg-gradient-to-br from-primary to-secondary rounded-t-xl">
            Add To Playlist
          </h2>
          <ul className="flex flex-col gap-2">
            {isPlaylistsLoading ? (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="p-2"
              >
                <span className="animate-pulse">Loading ...</span>
              </motion.li>
            ) : playlists?.length === 0 ? (
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="p-2"
              >
                <span className="text-base-content/70 text-sm text-center">
                  No playlists available :(
                </span>
              </motion.li>
            ) : (
              playlists?.map((playlist) => {
                const alreadyInPlayList = playlist.songs.some(
                  (p) => p.title === currentSong?.title
                );
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
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                    <button
                      disabled={alreadyInPlayList || isPending}
                      className="w-full h-full cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50 p-2"
                    >
                      <span>{playlist.name}</span>
                      {alreadyInPlayList && (
                        <span className="badge badge-primary badge-xs ml-2">
                          Added
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })
            )}
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default PlaylistDropdown;