import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../../configs/axios";
import { Music, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useAlbums } from "../../../../../hooks/album.hook";
import { toast } from "sonner";
import AlbumsTableSkeleton from "../../../../../components/ui/skeletons/AlbumsTableSkeleton";

const AlbumsTable = () => {
  const {data : albums, isLoading} = useAlbums();
  const queryClient = useQueryClient();

  const { mutate: deleteAlbum, isPending } = useMutation({
    mutationKey: ["deleteAlbum"],
    mutationFn: async (id: string) => {
      if (!id) {
        toast.error("Error Deleting Album | Id is Required");
        return;
      }
      await axiosInstance.delete(`/admin/albums/${id}`);
    },
    onSuccess: () => {
      toast.success("album deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error deleting album");
    },
  });

  const handleDeleteAlbum = (songId: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteAlbum(songId);
    }
  };

  if (isLoading) {
    return <AlbumsTableSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 60 }}
      className="overflow-x-auto mt-6 sm:mt-8 bg-base-300 p-3 sm:p-4 rounded-md max-h-[500px] overflow-y-auto"
    >
      <table className="table table-zebra bg-base-100 shadow-md border border-base-300 rounded-md rounded-box w-full">
        <thead className="bg-base-200 text-base-content sticky -top-4 text-xs sm:text-sm">
          <tr>
            <th className="w-1/3">Title</th>
            <th className="w-1/4">Artist</th>
            <th className="w-1/6">Release Year</th>
            <th className="w-1/6">Songs</th>
            <th className="w-1/6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {albums?.map((album) => (
            <tr key={album._id}>
              <td className="font-semibold flex items-center gap-2 text-xs sm:text-sm">
                <img
                  src={album.imageUrl}
                  className="size-8 sm:size-10 rounded-md"
                  alt={`${album.title} image`}
                />
                {album.title}
              </td>
              <td className="text-xs sm:text-sm">{album.artist}</td>
              <td className="text-xs sm:text-sm">{album.releaseYear}</td>
              <td className="text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  {album.songs.length} songs
                  <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </td>
              <td className="text-right">
                <button disabled={isPending} onClick={() => handleDeleteAlbum(album._id)} className="btn btn-sm btn-error btn-circle btn-soft">
                  <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default AlbumsTable;