import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMusic } from "../../store/music.store";
import { axiosInstance } from "../../configs/axios";
import { toast } from "sonner";
import type { IAlbum, ISong } from "../../interfaces/interfaces";
import { usePlayList } from "../../hooks/playlist.hook";
import MusicPlayer from "../../components/shared/musicPlayer/MusicPlayer";
import PlaylistHeader from "./ui/PlayListHeader";
import PlaylistBanner from "./ui/PlayListBanner";
import ActionButtons from "./ui/ActionButtons";
import SongList from "./ui/SongList";
import EditModal from "./ui/modals/EditModal";
import AddSongModal from "./ui/modals/AddSongModal";

const deletePlaylist = async (playlistId: string): Promise<void> => {
  await axiosInstance.delete(`/playlists/${playlistId}`);
};

const updatePlaylist = async (
  playlistId: string,
  updates: { songId?: string; name?: string }
) => {
  const { data } = await axiosInstance.put(`/playlists/${playlistId}`, updates);
  return data;
};

const PlaylistPage = () => {
  const { isSignedIn } = useUser();
  const { id: playlistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    currentSong,
    setCurrentSong,
    setCurrentAlbum,
    isPlaying,
    playSong,
    pauseSong,
    isShowMusicPlayer,
    setIsShowMusicPlayer,
  } = useMusic();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const { data: playlist, isLoading: isPlaylistLoading } = usePlayList(
    isSignedIn as boolean,
    playlistId as string
  );

  const { mutate: updatePlayList, isPending } = useMutation({
    mutationFn: (updates: { songId?: string; name?: string }) =>
      updatePlaylist(playlistId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
      setIsEditModalOpen(false);
      setIsShowMusicPlayer(false);
      setNewName("");
      toast.success("Playlist updated successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Error updating playlist");
    },
  });

  const { mutate: deletePlayList, isPending: isPendingDeletePlayList } =
    useMutation({
      mutationFn: () => deletePlaylist(playlistId!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["playlists"] });
        navigate("/playlists");
        toast.success("Playlist deleted successfully");
      },
      onError: () => {
        toast.error("Error deleting playlist");
      },
    });

  const handleRename = () => {
    if (newName.trim().length < 4 || newName.trim().length > 100) {
      toast.error("Playlist name must be 4-100 characters");
      return;
    }
    updatePlayList({ name: newName });
  };

  const handlePlayPause = (song: ISong) => {
    setIsShowMusicPlayer(true);
    if (currentSong?._id === song._id && isPlaying) {
      pauseSong();
    } else if (currentSong?._id === song._id && !isPlaying) {
      playSong();
    } else {
      const virtualAlbum: IAlbum = {
        _id: `${playlist ? playlist.name : "playlist"} album`,
        title: `${playlist ? playlist.name : "playlist album"}`,
        artist: "Various Artists",
        imageUrl: "",
        releaseYear: new Date().getFullYear(),
        songs: playlist?.songs as ISong[],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentSong(song, virtualAlbum);
    }
  };

  const handlePlayPauseAlbum = () => {
    if (playlist && playlist.songs.length > 0 && !isPlaying) {
      setIsShowMusicPlayer(true);
      if (currentSong) {
        playSong();
      } else {
        setCurrentSong(playlist.songs[0]);
        const virtualAlbum: IAlbum = {
          _id: `${playlist ? playlist.name : "playlist"} album`,
          title: `${playlist ? playlist.name : "playlist album"}`,
          artist: "Various Artists",
          imageUrl: "",
          releaseYear: new Date().getFullYear(),
          songs: playlist?.songs as ISong[],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setCurrentAlbum(virtualAlbum);
      }
      playSong();
    } else {
      pauseSong();
    }
  };

  const handleRemoveSong = (songId: string) => {
    updatePlayList({ songId });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8"
    >
      <PlaylistHeader playlistName={playlist?.name || "Loading..."} />
      <PlaylistBanner playlistName={playlist?.name} />
      <ActionButtons
        playlist={playlist}
        isPlaying={isPlaying}
        isPendingDeletePlayList={isPendingDeletePlayList}
        isShowMusicPlayer={isShowMusicPlayer}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsAddSongModalOpen={setIsAddSongModalOpen}
        setIsShowMusicPlayer={setIsShowMusicPlayer}
        handlePlayPauseAlbum={handlePlayPauseAlbum}
        deletePlayList={deletePlayList}
        setNewName={setNewName}
      />
      <SongList
        playlist={playlist}
        isPlaylistLoading={isPlaylistLoading}
        currentSong={currentSong as ISong}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
      />
      <EditModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        newName={newName}
        setNewName={setNewName}
        isPending={isPending}
        handleRename={handleRename}
      />
      <AddSongModal
        isOpen={isAddSongModalOpen}
        setIsOpen={setIsAddSongModalOpen}
        playlist={playlist}
        isPlaylistLoading={isPlaylistLoading}
        isPending={isPending}
        handleRemoveSong={handleRemoveSong}
      />
      <MusicPlayer />
    </motion.div>
  );
};

export default PlaylistPage;
