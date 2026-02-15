import { api } from "../config/AxiosHelper";

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getCurrentUser = () =>
  api.get("/auth/me");

export const logoutUser = () =>
  api.post("/auth/logout");

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfile = (data) =>
  api.put("/auth/profile", data);

export const deleteRoom = (roomId) =>
  api.delete(`/rooms/room/${roomId}`);

export const removeUserJoined = async (roomId) => {
  const res = await api.post("/auth/leave", { roomId });
  return res.data;
};

export const deleteAccount = (password) =>
  api.delete("/auth/delete", {
    data: { password },
  });

