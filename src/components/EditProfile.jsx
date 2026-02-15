import { useEffect, useState, useContext } from "react";
import { getProfile, updateProfile, deleteAccount } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const USERNAME_REGEX =
  /^(?=.{3,20}$)(?!.*\.\.)(?!.*__)[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])$/;

const PASSWORD_REGEX = /^\S{6,20}$/;

const EditProfile = () => {
  const { setUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

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
        toast.error(
          "Username must be 3–20 characters. Letters, numbers, . and _ only."
        );
        return;
      }
      payload.username = username;
    }

    if (currentPassword && newPassword) {
      if (!PASSWORD_REGEX.test(newPassword)) {
        toast.error("Password must be 6–20 characters with no spaces");
        return;
      }
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

  async function handleDeleteAccount() {
    if (!deletePassword) {
      toast.error("Please enter your password");
      return;
    }

    try {
      await deleteAccount(deletePassword);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      toast.success("Account deleted successfully");

      window.location.href = "/home";
    } catch (err) {
      toast.error(err.response?.data || "Incorrect password");
    }
  }

  if (loading) return null;

  return (
    <div className="max-w-md mx-auto backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl w-full">
      <h1 className="text-2xl font-semibold text-white mb-6">Edit Profile</h1>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

        {/* Username */}
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          autoComplete="username"
          className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />

        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            autoComplete="current-password"
            className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 border border-white/20
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            autoComplete="new-password"
            className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 border border-white/20
                       text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={saveProfile}
          className="w-full mt-4 py-3 rounded-full bg-blue-500/80 hover:bg-blue-500 transition"
        >
          Save Changes
        </button>

        {/* Delete Section */}
        {!deleteMode ? (
          <button
            type="button"
            onClick={() => setDeleteMode(true)}
            className="w-full mt-4 py-3 rounded-full 
                       bg-red-500/80 hover:bg-red-600 
                       transition font-medium 
                       border border-red-400/30 
                       shadow-lg shadow-red-500/20"
          >
            Delete Account
          </button>
        ) : (
          <div className="mt-4 space-y-3 p-4 rounded-2xl bg-red-500/10 border border-red-400/30">
            <p className="text-red-400 text-sm text-center">
              Enter your password to confirm deletion
            </p>

            <div className="relative">
              <input
                type={showDeletePassword ? "text" : "password"}
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Confirm password"
                autoComplete="current-password"
                className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 
                           border border-red-400/40 text-white 
                           focus:outline-none focus:ring-2 
                           focus:ring-red-500/50"
              />
              <button
                type="button"
                onClick={() => setShowDeletePassword(!showDeletePassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-400"
              >
                {showDeletePassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteMode(false);
                  setDeletePassword("");
                  setShowDeletePassword(false);
                }}
                className="flex-1 py-3 rounded-full bg-gray-500/40 hover:bg-gray-500/60 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
