import { useState, useContext } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { joinRoom, updateUserJoined } from "../services/RoomService";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { MdClose } from "react-icons/md";
import { removeUserJoined } from "../services/AuthService";

const JoinRoom = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const leaveJoinedRoom = async (roomId) => {
    try {
      const res = await removeUserJoined(roomId);
      setUser(res);
      localStorage.setItem("user", JSON.stringify(res));
      toast.success("Left room");
    } catch {
      toast.error("Failed to leave room");
    }
  };

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
    setUser(updatedUser);

    toast.success("Joined room successfully 🎉");
    navigate(`/chat/${detail.roomId}`);
  }

  return (
    <div className="w-full h-full flex items-start md:items-center justify-center px-4 overflow-y-auto md:overflow-hidden pt-6 md:pt-0 md:mt-16 ">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
        <div className="p-10 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl ">
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
              className="px-6 py-3 rounded-full bg-blue-500/70 hover:bg-blue-500 transition"
            >
              Join Room
            </button>

            <button
              onClick={() => navigate("/create")}
              className="px-6 py-3 rounded-full bg-orange-500/70 hover:bg-orange-500 transition"
            >
              Create Room
            </button>
          </div>
        </div>

        <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl flex flex-col">
          <h2 className="text-lg font-semibold text-center mb-4">
            Previously Joined Rooms
          </h2>

          {joinedRooms.length === 0 ? (
            <p className="text-center text-gray-500 text-sm italic">
              You haven’t joined any rooms yet
            </p>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 max-h-64 md:max-h-80 custom-scrollbar">
              {joinedRooms.map((room, index) => (
                <div
                  key={index}
                  className="relative w-full p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-left"
                  onClick={() => navigate(`/chat/${room.roomId}`)}
                >
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveJoinedRoom(room.roomId);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full
      text-gray-400 hover:text-red-400 hover:bg-white/10"
                    title="Leave room"
                  >
                    <MdClose size={16} />
                  </button>

                  <div className="font-medium">{room.roomName}</div>
                  <div className="text-xs text-gray-400">{room.roomId}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
