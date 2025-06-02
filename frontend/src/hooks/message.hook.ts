import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../configs/axios";
import type { IMessage } from "../interfaces/interfaces";

interface MessagesResponse {
  data: IMessage[];
}

export const useMessages = (selectedUserId: string) => {
  return useQuery<IMessage[]>({
    queryKey: ["messages", selectedUserId],
    enabled: !!selectedUserId,
    queryFn: async () => {
        const res = await axiosInstance.get<MessagesResponse>(`/users/messages/${selectedUserId}`);
        return res.data.data as IMessage[];
      },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};