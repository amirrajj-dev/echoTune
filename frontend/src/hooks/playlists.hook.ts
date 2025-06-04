import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { IPlayList } from "../interfaces/interfaces";

interface PlayListResponse {
  data: IPlayList[];
}

export const usePlayLists = (isSignedIn: boolean) => {
  return useQuery<IPlayList[]>({
    queryKey: ["playlists"],
    enabled: !!isSignedIn,
    queryFn: async () => {
        const res = await axiosInstance.get<PlayListResponse>(`/playlists`);
        return res.data.data as IPlayList[];
      },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};