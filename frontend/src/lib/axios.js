import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://leetlab-api.onrender.com/",
  withCredentials: true,
});


