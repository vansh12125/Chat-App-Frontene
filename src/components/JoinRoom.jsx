import { useState, useContext } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { joinRoom, updateUserJoined } from "../services/RoomService";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const JoinRoom = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  const currentUser = user.username;
  const joinedRooms = user.roomsJoined || [];
  const [detail, setDetail] = useState({ roomId: "" });

  function handleInputchange(e) {
    setDetail({ roomId: e.target.value });
  }

  async function joinChatHandle() {
    if (!detail.roomId.trim()) {
      toast.error("Please enter Room ID");
      return;
    }

    const room = await joinRoom(detail.roomId);
    if (!room) return;

    const updatedUser = await updateUserJoined(currentUser, detail.roomId);

    setUser(updatedUser); // ✅ CORRECT

    toast.success("Joined room successfully 🎉");
    navigate(`/chat/${detail.roomId}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <div className="w-full max-w-md p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        <img src={chatIcon} className="w-20 mx-auto mb-4" alt="chat" />

        <h1 className="text-2xl font-semibold text-center mb-6">
          Join or Create a Room
        </h1>

        <div className="mb-4">
          <label className="text-sm text-gray-300">Your Name</label>
          <input
            value={currentUser}
            readOnly
            className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-300">Room ID</label>
          <input
            value={detail.roomId}
            onChange={handleInputchange}
            className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={joinChatHandle}
            className="px-6 py-3 rounded-full bg-blue-500/70"
          >
            Join Room
          </button>

          <button
            onClick={() => navigate("/create")}
            className="px-6 py-3 rounded-full bg-orange-500/70"
          >
            Create Room
          </button>
        </div>

        <div className="my-6 border-t border-white/10" />

        <h2 className="text-sm text-center mb-3">
          Previously Joined Rooms
        </h2>

        {joinedRooms.length === 0 ? (
          <p className="text-center text-gray-500 text-sm italic">
            You haven’t joined any rooms yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {joinedRooms.map((room, index) => (
              <button
                key={index}
                onClick={() => navigate(`/chat/${room.roomId}`)}
                className="w-full py-2 rounded-full bg-white/10 border border-white/20"
              >
                <div className="font-medium">{room.roomName}</div>
                <div className="text-xs text-gray-400">{room.roomId}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoom;
