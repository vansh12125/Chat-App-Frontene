import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { createRoom, updateUserJoined } from "../services/RoomService";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;

const CreateRoom = () => {
  const { user, setUser } = useContext(AuthContext);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function validateInput() {
    if (!roomName.trim()) {
      toast.error("Room name cannot be empty!");
      return false;
    }
    if (!USERNAME_REGEX.test(roomName)) {
      toast.error("Room Name must be 3–20 letters/numbers only");
      return false;
    }
    return true;
  }

  async function handleCreateRoom() {
    if (!validateInput()) return;

    const response = await createRoom(roomName, user);
    setRoomId(response.roomId);
    setOpen(true);
    toast.success("Room created successfully 🎉");
  }

  async function copyRoomId() {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  }

  function shareOnWhatsApp() {
    const message = `Join my chat room!

Room Name: ${roomName}
Room ID: ${roomId}
URL: https://chat-app-frontene.vercel.app/chat/${roomId}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      
      
      <div className="w-full max-w-md p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">

        <h1 className="text-2xl font-semibold text-center mb-8">
          Create Chat Room
        </h1>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">
            Room Name
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
            placeholder="Enter room name"
            className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={!roomName}
          className="w-full py-3 rounded-full bg-blue-500/70 hover:bg-blue-500
                     transition disabled:opacity-40"
        >
          Create Room
        </button>
      </div>

      
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          
          <div className="w-full max-w-sm bg-slate-900/90 p-8 rounded-3xl
                          border border-white/20 shadow-2xl text-center">

            <h2 className="text-xl font-semibold mb-4">
              Room Created 🎉
            </h2>

            <p className="text-sm text-gray-400 mb-2">Room ID</p>

            <div className="bg-black/40 py-3 rounded-xl font-mono text-lg mb-5">
              {roomId}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={copyRoomId}
                className="py-2 rounded-full bg-blue-500/70 hover:bg-blue-500 transition"
              >
                Copy Room ID
              </button>

              <button
                onClick={async () => {
                  const res = await updateUserJoined(user.username, roomId);
                  setUser(res);
                  navigate(`/chat/${roomId}`);
                }}
                className="py-2 rounded-full bg-green-500/70 hover:bg-green-500 transition"
              >
                Join Room
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="py-2 rounded-full bg-emerald-600/70 hover:bg-emerald-600 transition"
              >
                Share on WhatsApp
              </button>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-5 text-sm text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
