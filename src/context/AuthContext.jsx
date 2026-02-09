import { createContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await logoutUser(); 
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("token"); 
    setUser(null);

    toast.success("Logged out");
    navigate("/login");
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (err) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, refreshUser, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
