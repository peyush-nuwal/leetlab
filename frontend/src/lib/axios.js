import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "https://leetlab-api.onrender.com/",
  withCredentials: true,
});


