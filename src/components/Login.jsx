import { useContext, useEffect, useState } from "react";
import { loginUser } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const USERNAME_REGEX =
/^(?=.{3,20}$)(?!.*\.\.)(?!.*__)[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])$/;

const PASSWORD_REGEX = /^\S{6,20}$/;


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({ username: "", password: "" });
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/join");
    }
  }, [user, navigate]);

  async function submit(e) {
    e.preventDefault();

    if (!USERNAME_REGEX.test(data.username)) {
      toast.error("Invalid username format");
      return;
    }

    if (!PASSWORD_REGEX.test(data.password)) {
      toast.error("Password must be 6–20 characters with no spaces");
      return;
    }

    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      toast.success("Login successful 🎉");
      navigate("/join");
    } catch (err) {
      toast.error("Invalid username or password");
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white w-full">
      <div className="w-full max-w-md p-10 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-300 text-center mb-8">
          Sign in to continue
        </p>

        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Username"
            value={data.username}
            autoComplete="username"
            onChange={(e) => setData({ ...data, username: e.target.value })}
            className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-5 py-3 rounded-full bg-white/10 border border-white/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black/70"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-blue-500/80 hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
