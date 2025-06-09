import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api/v1" : "https://leetlab-drab.vercel.app/api/v1",
  withCredentials: true,
});


