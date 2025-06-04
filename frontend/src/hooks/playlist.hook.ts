import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { IPlayList } from "../interfaces/interfaces";

interface PlayListResponse {
  data: IPlayList;
}

export const usePlayList = (isSignedIn: boolean , playlistId : string) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    enabled: !!isSignedIn && !!playlistId,
    queryFn:  async ()=> {
      const { data } = await axiosInstance.get<PlayListResponse>(
        `/playlists/${playlistId}`
      );
      return data.data as IPlayList;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};