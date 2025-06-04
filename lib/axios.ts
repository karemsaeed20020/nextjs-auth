import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend.outletplus.sa/",
  headers: {
    "Content-Type": "application/json",
  },
});


export default axiosInstance;