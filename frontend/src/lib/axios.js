import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://leetlab-api.onrender.com/" : "/api/v1",
  withCredentials: true,
});


