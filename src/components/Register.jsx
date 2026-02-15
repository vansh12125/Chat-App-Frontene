import { useState } from "react";
import { registerUser } from "../services/AuthService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const USERNAME_REGEX =
  /^(?=.{3,20}$)(?!.*\.\.)(?!.*__)[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])$/;
const PASSWORD_REGEX = /^\S{6,20}$/;

const Register = () => {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!USERNAME_REGEX.test(data.username)) {
      toast.error(
        "Username must be 3–20 characters. Letters, numbers, . and _ only. No spaces.",
      );
      return;
    }

    if (!PASSWORD_REGEX.test(data.password)) {
      toast.error("Password must be 6–20 characters with no spaces");
      return;
    }

    try {
      await registerUser(data);
      toast.success("Registered successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    }
  }

  return (
    <div className=" w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white mt-16">
      <div className="w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Create Account
        </h1>
        <p className="text-sm text-gray-300 text-center mb-8">
          Join the conversation
        </p>

        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Username"
            autoComplete="username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20
                       placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-emerald-500/50 backdrop-blur-md"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="new-password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20
               placeholder-gray-400 focus:outline-none focus:ring-2
               focus:ring-emerald-500/50 backdrop-blur-md"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2
               text-gray-400 hover:text-black/70"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500
                       transition font-medium shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
        <p className="text-sm text-gray-400 text-center mt-6">
          Back To{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/home")}
          >
            Home
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
