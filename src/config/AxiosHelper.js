import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

