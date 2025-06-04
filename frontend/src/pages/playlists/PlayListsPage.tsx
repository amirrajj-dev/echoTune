import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { usePlayLists } from "../../hooks/playlists.hook";
import { axiosInstance } from "../../configs/axios";
import { toast } from "sonner";
import type { IPlayList } from "../../interfaces/interfaces";
import PlaylistsHeader from "./ui/PlayListHeader";
import CreatePlaylistBtn from "./ui/CreatePlayListBtn";
import PlaylistsList from "./ui/PlayListsList";
import CreatePlaylistModal from "./ui/modals/CreatePlayListModal";

const PlayListsPage = () => {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const { data: playlists, isLoading } = usePlayLists(isSignedIn as boolean);
  const { mutate: createPlayList, isPending } = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await axiosInstance.post("/playlists", { name });
      return data.data as IPlayList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      setIsModalOpen(false);
      setPlaylistName("");
      toast.success("Playlist created successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Error creating playlist");
    },
  });

  const handleCreatePlaylist = () => {
    if (playlistName.trim().length < 4) return;
    createPlayList(playlistName);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8"
    >
      <PlaylistsHeader />
      <CreatePlaylistBtn setIsModalOpen={setIsModalOpen} />
      <PlaylistsList playlists={playlists} isLoading={isLoading} />
      <CreatePlaylistModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        playlistName={playlistName}
        setPlaylistName={setPlaylistName}
        isPending={isPending}
        handleCreatePlaylist={handleCreatePlaylist}
      />
    </motion.div>
  );
};

export default PlayListsPage;