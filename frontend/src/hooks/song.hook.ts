import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { ISong } from "../interfaces/interfaces";

interface SongsResponse {
  data: ISong[];
}

export const useSongs = () => {
  return useQuery<ISong[]>({
    queryKey: ["songs"],
    queryFn: async () => {
        const res = await axiosInstance.get<SongsResponse>("/songs");
        return res.data.data;
      },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};