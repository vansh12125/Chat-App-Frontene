import { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden">
      <Header onMenuClick={() => setOpen(true)} />

      <Sidebar open={open} setOpen={setOpen} />

      <main className="h-[calc(100vh-64px)] flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
