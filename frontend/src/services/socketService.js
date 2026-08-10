import { io } from "socket.io-client";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local"));

const SOCKET_URL = isLocalhost
  ? "http://localhost:5000"
  : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : "https://backend-mp6m.onrender.com");

class SocketService {
  socket = null;
  initialized = false;

  init(dealerId, isAdmin = false) {
    if (this.socket && this.socket.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true
    });

    this.socket.on("connect", () => {
      console.log("⚡ Socket.IO Connected:", this.socket.id);
      if (isAdmin) {
        this.socket.emit("join_admin");
      } else if (dealerId) {
        this.socket.emit("join_dealer", dealerId);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Socket.IO Disconnected");
    });
  }

  onNotification(callback) {
    if (!this.socket) return;
    this.socket.on("NOTIFICATION", (data) => {
      console.log("🔔 Realtime Notification Received:", data);
      if (callback) callback(data);
    });
  }

  onAdminNotification(callback) {
    if (!this.socket) return;
    this.socket.on("ADMIN_NOTIFICATION", (data) => {
      console.log("👑 Admin Notification Received:", data);
      if (callback) callback(data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
