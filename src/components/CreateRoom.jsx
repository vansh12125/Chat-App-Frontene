import { useState } from "react";
import toast from "react-hot-toast";
import { createRoom } from "../services/RoomService";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUserJoined } from "../services/RoomService";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;
// const { refreshUser } = useContext(AuthContext);
const CreateRoom = () => {
  const { user, setUser } = useContext(AuthContext);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function validateInput() {
    if (roomName.trim() === "") {
      toast.error("Room name cannot be empty!");
      setRoomName("");
      return false;
    }
    if (!USERNAME_REGEX.test(roomName)) {
      toast.error("Room Name must be 3–20 letters/numbers only");
      return false;
    }
    return true;
  }

  async function handleCreateRoom() {
    if (validateInput()) {
      const response = await createRoom(roomName, user);
      setRoomId(response.roomId);
      setOpen(true);
      toast.success("Room created successfully 🎉");
      console.log(roomName, roomId, user);
      return response;
    }
  }

  async function copyRoomId() {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  }

  function shareOnWhatsApp() {
    const message = `Hey 
Join my chat room!

 Room Name: ${roomName}
 Room ID: ${roomId}
 URL: https://chat-app-frontene.vercel.app/chat/${roomId}
Open the app and enter this Room ID to join.`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div
      className=" min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white"
    >
      <div
        className="w-full max-w-md p-10 rounded-3xl backdrop-blur-xl
                      bg-white/10 border border-white/20 shadow-2xl"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create Chat Room
        </h1>

        <div className="mb-6">
          <label className="block text-sm text-gray-300 mb-2">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleCreateRoom()}
            placeholder="Enter room name"
            className="w-full px-5 py-3 rounded-full bg-white/10
                       border border-white/20 text-white
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500/50"
          />
        </div>

        <button
          onClick={handleCreateRoom}
          disabled={!roomName}
          className="w-full py-3 rounded-full bg-blue-500/70
                     hover:bg-blue-500 transition disabled:opacity-40"
        >
          Create Room
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div
            className="bg-slate-900 p-8 rounded-2xl w-96 text-center
                          border border-white/20 backdrop-blur-xl"
          >
            <h2 className="text-xl font-semibold mb-4">Room Created 🎉</h2>

            <p className="text-sm text-gray-400 mb-1">Room ID</p>

            <div
              className="bg-black/40 py-3 rounded-lg font-mono
                            text-lg tracking-wider mb-4"
            >
              {roomId}
            </div>

            <button
              onClick={() => {
                copyRoomId();
              }}
              className="w-full mb-3 py-2 rounded-full
                         bg-green-400/70 hover:bg-green-500 transition"
            >
              Copy Room ID
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await updateUserJoined(user.username, roomId);   
                  console.log("User updated with new room:", res.data);      
                  setUser(res);
                  navigate(`/chat/${roomId}`);
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to join room");
                }
              }}
              className="w-full mb-3 py-2 rounded-full
             bg-green-400/70 hover:bg-green-500 transition"
            >
              Click To Join Room
            </button>

            <button
              onClick={shareOnWhatsApp}
              className="w-full mb-5 py-2 rounded-full
                         bg-emerald-600/70 hover:bg-emerald-600 transition"
            >
              Share via WhatsApp
            </button>

            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-400 hover:text-white"
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
