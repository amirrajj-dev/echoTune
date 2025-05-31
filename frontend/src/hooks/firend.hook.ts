import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { IUser } from "../interfaces/interfaces";

interface FirendsResponse {
  data: IUser[];
}

export const useFriends = () => {
  return useQuery<IUser[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FirendsResponse>("/users");
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
