import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";

interface StatsResponse {
  data: {
    uniqueArtists: number;
    totalSongs: number;
    totalAlbums: number;
    totalUsers: number;
  };
}

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const {data} = await axiosInstance.get<StatsResponse>("/stats");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
