import axios from "axios";

const primaryApiUrl = import.meta.env.VITE_API_URL || "https://durga-manufactor.onrender.com/api";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local"));

const baseURL = isLocalhost
  ? "http://localhost:5000/api"
  : primaryApiUrl;

const API = axios.create({
  baseURL,
});

/* Attach JWT Token Automatically */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("dealer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Automatic Failover to backup API endpoint if primary network fails */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) &&
      !originalRequest._retry &&
      !isLocalhost
    ) {
      originalRequest._retry = true;
      originalRequest.baseURL = "https://b.durgamanufactures.com/api";
      return API(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default API;