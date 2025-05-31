import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { IAlbum } from "../interfaces/interfaces";

interface AlbumsResponse {
  data: IAlbum[];
}

export const useAlbums = () => {
  return useQuery<IAlbum[]>({
    queryKey: ["albums"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<AlbumsResponse>("/albums");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};