import React, { useEffect, useRef, useState, useContext } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { Client } from "@stomp/stompjs";
import { useParams, useNavigate } from "react-router";
import { api } from "../config/AxiosHelper";
import { AuthContext } from "../context/AuthContext";
import SockJS from "sockjs-client";
import toast from "react-hot-toast";
import avatar from "../assets/avatar.png";

const ChatPage = () => {
  const [roomName, setRoomName] = useState("");
  const [connected, setConnected] = useState(false);

  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [createdBy, setCreatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const currentUser = user?.username || "Guest";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    async function loadRoom() {
      const res = await api.get(`/rooms/room/${roomId}`);
      setRoomName(res.data.roomName);
      setCreatedBy(res.data.createdBy);
      setCreatedAt(res.data.createdAt);
    }
    if (roomId) loadRoom();
  }, [roomId]);

  useEffect(() => {
    async function loadMessages() {
      const res = await api.get(`/messages/${roomId}?page=0&size=50`);
      setMessages(res.data.reverse());
      scrollToBottom();
    }
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_URL}/chat`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          setMessages((prev) => [...prev, JSON.parse(msg.body)]);
          scrollToBottom();
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      setConnected(false);
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!connected) {
      toast.error("Connecting to chat… please wait");
      return;
    }

    if (input.trim().length === 0) {
      toast.error("Message cannot be empty!");
      setInput("");
      inputRef.current.focus();
      return;
    }
    if (!input.trim() || input.length > 2000) {
      toast.error("Message is too long! Max 2000 characters.");
      return;
    }
    if (!stompClientRef.current?.connected) return;

    stompClientRef.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({ sender: currentUser, content: input }),
    });

    setInput("");
    inputRef.current.focus();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  async function copyRoomId() {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied!");
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div onClick={() => setShowRoomInfo(true)} className="cursor-pointer">
            <p className="text-xs text-gray-400">Room</p>
            <p className="text-lg font-semibold truncate max-w-[220px]">
              {roomName}
            </p>
          </div>

          <button
            onClick={() => navigate("/join")}
            className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition"
          >
            Leave
          </button>
        </div>
      </header>

      {/* CHAT */}
      <main
        ref={chatBoxRef}
        className="pt-20 pb-28 px-4 max-w-4xl mx-auto h-[100dvh] overflow-y-auto no-scrollbar"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl p-4 backdrop-blur-xl border shadow-lg ${
                message.sender === currentUser
                  ? "bg-green-500/20 border-green-400/30"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <div className="flex gap-3">
                <img
                  src={avatar}
                  className="h-9 w-9 rounded-full ring-2 ring-white/30"
                />
                <div>
                  <p className="text-xs text-gray-300 font-semibold">
                    {message.sender}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timeStamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-4 w-full">
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message…"
            className="flex-1 bg-transparent outline-none text-white"
          />

          <button
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 
             flex items-center justify-center"
          >
            <MdAttachFile size={18} />
          </button>

          <button
            disabled={!connected}
            onClick={sendMessage}
            className="h-10 w-10 rounded-full bg-green-500/70 hover:bg-green-500
             flex items-center justify-center"
          >
            <MdSend size={18} />
          </button>
        </div>
      </div>

      {showRoomInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center">
          <div className="w-full md:max-w-md bg-slate-900/95 rounded-t-3xl md:rounded-3xl p-6 border border-white/20">
            <div className="md:hidden w-12 h-1 bg-gray-500/40 rounded-full mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-center mb-6">
              Room Information
            </h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400">Room Name</p>
                <p className="text-white font-medium">{roomName}</p>
              </div>

              <div>
                <p className="text-gray-400">Room ID</p>
                <button
                  onClick={copyRoomId}
                  className="text-blue-400 font-mono hover:underline"
                >
                  {roomId}
                </button>
              </div>

              <div>
                <p className="text-gray-400">Created By</p>
                <p className="text-white">{createdBy}</p>
              </div>

              <div>
                <p className="text-gray-400">Created At</p>
                <p className="text-white">
                  {new Date(createdAt).toLocaleString([], {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => navigate("/join")}
                className="py-3 rounded-full bg-red-500/70 hover:bg-red-500"
              >
                Leave Room
              </button>

              <button
                onClick={() => setShowRoomInfo(false)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
