import { useNavigate } from "react-router";
import { logoutUser } from "../services/AuthService";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }

    setUser(null);
    setOpen(false);
    toast.success("Logged out");
    navigate("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        backdrop-blur-2xl bg-white/10 border-r border-white/20`}
      >
        <div className="p-6 space-y-4">
          <SidebarItem label="Home" onClick={() => navigate("/home")} />
          <SidebarItem label="About" onClick={() => navigate("/about")} />
          {user !== null ? (
            <SidebarItem label="Join Room" onClick={() => navigate("/join")} />
          ) : (
            ""
          )}
          {user !== null ? (
            <SidebarItem label="Create Room" onClick={() => navigate("/create")} />
          ) : (
            ""
          )}
          {user !== null ? (
            <SidebarItem
              label="Edit Profile"
              onClick={() => navigate("/profile")}
            />
          ) : (
            ""
          )}

          <SidebarItem
            label="Contact Us"
            onClick={() => navigate("/contact")}
          />
          <hr className="border-white/20 my-4" />
          {user !== null ? (
            <SidebarItem label="Logout" danger onClick={handleLogout} />
          ) : (
            ""
          )}

          {user === null ? (
            <SidebarItem label={"Login"} onClick={() => navigate("/login")} />
          ) : (
            ""
          )}
          {user === null ? (
            <SidebarItem label={"Register"} onClick={() => navigate("/register")} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl transition
      ${danger ? "text-red-400 hover:bg-red-500/20" : "hover:bg-white/10"}`}
  >
    {label}
  </button>
);

export default Sidebar;
