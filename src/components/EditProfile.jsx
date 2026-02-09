import { useEffect, useState, useContext } from "react";
import { getProfile, updateProfile } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;

const EditProfile = () => {
  const { setUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    getProfile()
      .then((res) => {
        setUsername(res.data.username);
        setOriginalUsername(res.data.username);
      })
      .catch(() => {
        toast.error("Session expired. Please login again.");
      })
      .finally(() => setLoading(false));
  }, []);

  
  async function saveProfile() {
    const payload = {};

   
    if (username !== originalUsername) {
      if (!USERNAME_REGEX.test(username)) {
        toast.error("Invalid username format");
        return;
      }
      payload.username = username;
    }

    
    if (currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      toast("Nothing to update");
      return;
    }

    try {
      const res = await updateProfile(payload);

      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

     
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setOriginalUsername(res.data.user.username);
      }

      
      setCurrentPassword("");
      setNewPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);

      toast.success("Profile updated 🎉");
    } catch (err) {
      toast.error(err.response?.data || "Update failed");
    }
  }

  if (loading) return null;

  return (
    <div className="max-w-md mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl w-full">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Edit Profile
      </h1>

      {}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full mb-4 px-5 py-3 rounded-full bg-white/10 border border-white/20
                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />

      {}
      <div className="relative mb-4">
        <input
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 border border-white/20
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-black/70"
        >
          {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>

      {}
      <div className="relative">
        <input
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 border border-white/20
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-black/70"
        >
          {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
        </button>
      </div>

      <button
        onClick={saveProfile}
        className="w-full mt-6 py-3 rounded-full bg-blue-500/80 hover:bg-blue-500 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;
