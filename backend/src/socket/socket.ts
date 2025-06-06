import { Server } from "socket.io";
import { messagesModel } from "../models/message.model";

export const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      if (!userId) return;
      userSockets.set(userId, socket.id);
      userActivities.set(userId, { activity: "Idle" });

      console.log(`User connected: ${userId}`);
      io.emit("user_connected", userId);
      socket.emit("users_online", Array.from(userSockets.keys()));
      io.emit("user_activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity, song }) => {
      if (userId && activity) {
        const activityData = { activity, song };
        userActivities.set(userId, activityData);
        io.emit("activity_updated", { userId, activity, song });
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        if (!senderId || !receiverId || !content) {
          throw new Error("Missing required fields: senderId, receiverId, or content");
        }

        const message = await messagesModel.create({
          senderId,
          receiverId,
          content,
        });

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          console.log(`Emitting message to receiver: ${receiverSocketId}`);
          io.to(receiverSocketId).emit("receive_message", message);
        }

        socket.emit("message_sent", message);
        const senderSocketId = userSockets.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("receive_message", message);
        }
      } catch (error) {
        console.error("Message error:", error);
        socket.emit("message_error", error instanceof Error ? error.message : "Failed to send message");
      }
    });

    socket.on("typing", ({ userId, receiverId }) => {
      if (userId && receiverId) {
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("typing", { userId });
        }
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        console.log(`User disconnected: ${disconnectedUserId}`);
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });

  return io;
};