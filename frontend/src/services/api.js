import axios from "axios";

const API = axios.create({
    baseURL: "https://backend-mp6m.onrender.com/api",
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