import axios from "axios";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local"));

const baseURL = isLocalhost
  ? "http://localhost:5000/api"
  : (import.meta.env.VITE_API_URL || "https://b.durgamanufactures.com/api");

const API = axios.create({
  baseURL,
});

/* Attach JWT Token Automatically */

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default API;