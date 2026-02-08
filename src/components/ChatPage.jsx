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
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const currentUser = user?.username || "Guest";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const stompClientRef = useRef(null);
  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await api.get(`/rooms/room/${roomId}`);
        setRoomName(res.data.roomName);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to load room", err);
      }
    }

    if (roomId) loadRoom();
  }, [roomId]);

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await api.get(`/messages/${roomId}?page=0&size=50`);
        setMessages(res.data.reverse());
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    }
    loadMessages();
  }, [roomId]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/chat`),
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          const message = JSON.parse(msg.body);
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!stompClientRef.current?.connected) return;

    if(input.length>2000){
      toast.error("Message is too long! Max length is 2000 characters.");
      return;
    }

    stompClientRef.current.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({
        sender: currentUser,
        content: input,
      }),
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white no-scrollbar">
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-lg font-semibold tracking-wide">
            Room ID: <button className="text-blue-400" onClick={()=>copyRoomId()}>{roomId}</button>
          </h1>

          <h1 className="text-lg font-semibold tracking-wide">
            Room Name: <span className="text-blue-400">{roomName}</span>
          </h1>

          <h1 className="text-lg font-semibold tracking-wide">
            User: <span className="text-blue-400">{currentUser}</span>
          </h1>

          <button
            onClick={() => navigate("/join")}
            className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 backdrop-blur-md transition"
          >
            Leave
          </button>
        </div>
      </header>

      <main
        ref={chatBoxRef}
        className="pt-24 pb-28 px-6 max-w-4xl mx-auto h-screen 
             overflow-y-auto no-scrollbar smooth-scroll"
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
              <div className="flex gap-3 items-start">
                <img
                  className="h-9 w-9 rounded-full ring-2 ring-white/30 object-cover p-0.5"
                  src={avatar}
                  alt="avatar"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-300">
                    {message.sender}
                  </p>
                  <p className="text-sm leading-relaxed text-white">
                    {message.content}
                  </p>
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
        <div className="max-w-3xl mx-auto flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            type="text"
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
          />

          <button className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition">
            <MdAttachFile size={18} />
          </button>

          <button
            onClick={sendMessage}
            className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500/70 hover:bg-green-500 transition"
          >
            <MdSend size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
