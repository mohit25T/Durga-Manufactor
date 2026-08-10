import { Server } from "socket.io";
import DealerNotification from "../models/DealerNotification.js";

let io = null;

export const initSocket = (httpServer, corsOptions) => {
  io = new Server(httpServer, {
    cors: corsOptions || {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket Client Connected: ${socket.id}`);

    // Join room for specific dealer
    socket.on("join_dealer", (dealerId) => {
      if (dealerId) {
        const roomName = `dealer_${dealerId}`;
        socket.join(roomName);
        console.log(`👤 Socket ${socket.id} joined dealer room: ${roomName}`);
      }
    });

    // Join room for admin
    socket.on("join_admin", () => {
      socket.join("admin_room");
      console.log(`👑 Socket ${socket.id} joined admin_room`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.warn("⚠️ Socket.io not initialized yet.");
  }
  return io;
};

/**
 * Emit real-time notification to Socket room & persist in DB for dealer
 */
export const sendRealtimeNotification = async ({
  dealerId,
  title,
  message,
  type = "order_created",
  orderId = null,
  data = {}
}) => {
  try {
    // 1. Persist notification in DB if dealerId present
    let dbNotification = null;
    if (dealerId) {
      dbNotification = await DealerNotification.create({
        dealer: dealerId,
        order: orderId,
        title,
        message,
        type,
        read: false
      });
    }

    // 2. Emit real-time socket event to dealer room
    if (io && dealerId) {
      const room = `dealer_${dealerId}`;
      io.to(room).emit("NOTIFICATION", {
        _id: dbNotification ? dbNotification._id : Date.now().toString(),
        title,
        message,
        type,
        createdAt: new Date(),
        data
      });
    }

    // 3. Emit real-time socket event to admin room as well
    if (io) {
      io.to("admin_room").emit("ADMIN_NOTIFICATION", {
        title,
        message,
        type,
        dealerId,
        createdAt: new Date(),
        data
      });
    }
  } catch (error) {
    console.error("❌ Send Realtime Notification Error:", error);
  }
};
