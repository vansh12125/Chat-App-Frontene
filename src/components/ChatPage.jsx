import React, { useEffect, useRef, useState, useContext } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { Client } from "@stomp/stompjs";
import { useParams, useNavigate } from "react-router";
import { api } from "../config/AxiosHelper";
import { AuthContext } from "../context/AuthContext";
import SockJS from "sockjs-client";
import toast from "react-hot-toast";
import avatar from "../assets/avatar.png";


const notificationSound = new Audio("/sounds/notification.mp3");

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const currentUser = user?.username || "Guest";

  const [roomName, setRoomName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const stompClientRef = useRef(null);

  
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  
  useEffect(() => {
    if (!roomId) return;

    api
      .get(`/rooms/room/${roomId}`)
      .then((res) => {
        setRoomName(res.data.roomName);
        setCreatedBy(res.data.createdBy);
        setCreatedAt(res.data.createdAt);
      })
      .catch(() => toast.error("Failed to load room"));
  }, [roomId]);

 
  useEffect(() => {
    if (!roomId) return;

    api
      .get(`/messages/${roomId}?page=0&size=50`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMessages(res.data.reverse());
          scrollToBottom();
        }
      })
      .catch(() => toast.error("Failed to load messages"));
  }, [roomId]);

 
  useEffect(() => {
    if (!roomId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_URL}/chat`),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/room/${roomId}`, (msg) => {
          try {
            const message = JSON.parse(msg.body);
            if (!message?.content || !message?.sender) return;

            setMessages((prev) => [...prev, message]);
            scrollToBottom();

           
            if (
              document.hidden &&
              message.sender !== currentUser &&
              Notification.permission === "granted"
            ) {
              new Notification(`New message from ${message.sender}`, {
                body: message.content,
                icon: "/icons/image.png",
              });

              notificationSound.current?.play().catch(() => {});
            }
          } catch (err) {
            console.error("Invalid WS message", err);
          }
        });
      },

      onDisconnect: () => setConnected(false),
      onStompError: () => toast.error("WebSocket error"),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      setConnected(false);
    };
  }, [roomId, currentUser]);

  
  const sendMessage = () => {
    if (!connected) {
      toast.error("Connecting…");
      return;
    }

    if (!input.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (input.length > 2000) {
      toast.error("Message too long");
      return;
    }

    stompClientRef.current?.publish({
      destination: `/app/sendMessage/${roomId}`,
      body: JSON.stringify({
        sender: currentUser,
        content: input,
      }),
    });

    setInput("");
    inputRef.current?.focus();
  };

  
  const scrollToBottom = () => {
    setTimeout(() => {
      chatBoxRef.current?.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      
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
            className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
          >
            Leave
          </button>
        </div>
      </header>

      
      <main
        ref={chatBoxRef}
        className="pt-20 pb-28 px-4 max-w-4xl mx-auto h-[100dvh] overflow-y-auto no-scrollbar"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex mb-4 ${
              m.sender === currentUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-2xl p-4 backdrop-blur-xl border ${
                m.sender === currentUser
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
                    {m.sender}
                  </p>
                  <p className="text-sm">{m.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(m.timeStamp).toLocaleTimeString([], {
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

          <button className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <MdAttachFile size={18} />
          </button>

          <button
            disabled={!connected}
            onClick={sendMessage}
            className="h-10 w-10 rounded-full bg-green-500/70 hover:bg-green-500 flex items-center justify-center"
          >
            <MdSend size={18} />
          </button>
        </div>
      </div>

      
      {showRoomInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-3xl border border-white/20 w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Room Information
            </h2>

            <p className="text-gray-400 text-sm">Room Name</p>
            <p className="mb-3">{roomName}</p>

            <p className="text-gray-400 text-sm">Room ID</p>
            <button onClick={copyRoomId} className="text-blue-400 font-mono">
              {roomId}
            </button>

            <p className="text-gray-400 text-sm mt-3">Created By</p>
            <p>{createdBy}</p>

            <p className="text-gray-400 text-sm mt-3">Created At</p>
            <p>{new Date(createdAt).toLocaleString()}</p>

            <button
              onClick={() => setShowRoomInfo(false)}
              className="mt-6 w-full py-2 rounded-full bg-red-500/70"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
