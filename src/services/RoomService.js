import toast from "react-hot-toast";
import { api } from "../config/AxiosHelper";

export const createRoom = async (roomName, user,username) => {
  try {
    
    const response = await api.post("/rooms/room", {
      roomName,
      "createdBy": user,
      "username": username
    });
    
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    toast.error("Something went wrong! Please try again.");
  }
};

export const joinRoom = async (roomId) => {
  try {
    const response = await api.get(`/rooms/room/${roomId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      toast.error("Room not found! Please check the Room ID and try again.");
    } else {
      console.error("Error joining room:", error, error.response.status);
      toast.error("Something went wrong! Please try again.");
    }
  }
};

export const updateUserJoined = async (username, roomId) => {
  const res = await api.post("/auth/join", { username, roomId });
  return res.data;
};

