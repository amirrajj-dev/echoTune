import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { ISong } from "../interfaces/interfaces";

interface favoritesResponse {
  data: ISong[];
}

export const useFavourites = (userId  : string , isSignedIn : boolean) => {
  return useQuery<ISong[]>({
    queryKey: ["favourites"],
    queryFn: async ()=> {
      const {data} = await axiosInstance.get<favoritesResponse>('/users/favourites');
      return data.data;
    },
    enabled: !!isSignedIn && !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};