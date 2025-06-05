import { create } from "zustand";
import { io } from "socket.io-client";
import type { IMessage, IUser } from "../interfaces/interfaces";

interface Activity {
  activity: string;
  song?: { name: string; artist: string };
}

interface ChatStore {
  users: IUser[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, Activity>;
  messages: IMessage[];
  selectedUser: IUser | null;
  setUsers: (users: IUser[]) => void;
  setMessages: (messages: IMessage[]) => void;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  setSelectedUser: (user: IUser | null) => void;
}

const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  initSocket: (userId) => {
    if (!get().isConnected && userId) {
      socket.auth = { userId };
      socket.connect();

      socket.on("connect", () => {
        console.log(`Socket connected for user: ${userId}`);
        socket.emit("user_connected", userId);
        set({ isConnected: true });
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        set({ error: "Failed to connect to chat server" });
      });

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("user_activities", (activities: [string, Activity][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        });
      });

      socket.on("receive_message", (message: IMessage) => {
        set((state) => {
          // Only add if message involves selected user
          if (
            message.senderId === get().selectedUser?._id ||
            message.receiverId === get().selectedUser?._id
          ) {
            return { messages: [...state.messages, message] };
          }
          return state;
        });
      });

      socket.on("message_sent", (message: IMessage) => {
        set((state) => {
          if (
            message.senderId === userId ||
            message.receiverId === get().selectedUser?._id
          ) {
            return { messages: [...state.messages, message] };
          }
          return state;
        });
      });

      socket.on("activity_updated", ({ userId, activity, song }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, { activity, song });
          return { userActivities: newActivities };
        });
      });

      socket.on("message_error", (error: string) => {
        console.error("Message error:", error);
        set({ error });
      });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false, onlineUsers: new Set(), userActivities: new Map() });
    }
  },

  setMessages: (messages) => set({ messages }),

  setUsers: (users: IUser[]) => set({ users }),
}));