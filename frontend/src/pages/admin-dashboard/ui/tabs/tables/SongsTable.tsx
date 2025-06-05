import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../../../configs/axios";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import SongsTableSkeleton from "../../../../../components/ui/skeletons/SongsTableSkeleton";
import { useSongs } from "../../../../../hooks/song.hook";

const SongsTable = () => {
  const { data: songs, isLoading } = useSongs();
  const queryClient = useQueryClient();

  const { mutate: deleteSong, isPending } = useMutation({
    mutationKey: ["deleteSong"],
    mutationFn: async (id: string) => {
      if (!id) {
        toast.error("Error Deleting Song | Id is Required");
        return;
      }
      await axiosInstance.delete(`/admin/songs/${id}`);
    },
    onSuccess: () => {
      toast.success("Song deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (e) => {
      console.log(e);
      toast.error("Error deleting song");
    },
  });

  const handleDeleteSong = (songId: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      deleteSong(songId);
    }
  };

  if (isLoading) {
    return <SongsTableSkeleton />;
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
            <th className="w-1/4">Release Date</th>
            <th className="w-1/6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {songs && songs?.length > 0 ? (
            songs?.map((song) => (
              <tr key={song._id}>
                <td className="font-semibold flex items-center gap-2 text-xs sm:text-sm">
                  <img
                    src={song.imageUrl}
                    className="size-8 sm:size-10 rounded-md"
                    alt={`${song.title} image`}
                  />
                  {song.title}
                </td>
                <td className="text-xs sm:text-sm">{song.artist}</td>
                <td className="text-xs sm:text-sm">
                  {new Date(song.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <button
                    disabled={isPending}
                    className="btn btn-sm btn-error btn-circle btn-soft"
                    onClick={() => handleDeleteSong(song._id)}
                  >
                    <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                No Songs Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </motion.div>
  );
};

export default SongsTable;
