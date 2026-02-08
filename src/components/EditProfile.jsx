import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/AuthService";
import toast from "react-hot-toast";

const USERNAME_REGEX = /^[a-zA-Z0-9]{3,20}$/;

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(res => setUsername(res.data.username))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    if (!USERNAME_REGEX.test(username)) {
      toast.error("Invalid username format");
      return;
    }

    try {
      await updateProfile({ username });
      toast.success("Profile updated 🎉");
    } catch (err) {
      toast.error("Update failed");
    }
  }

  if (loading) return null;

  return (
    <div className="max-w-md mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Edit Profile
      </h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20
                   text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />

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
