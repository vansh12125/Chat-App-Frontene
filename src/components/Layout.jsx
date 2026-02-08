import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white z-50">
      <Header onMenuClick={() => setOpen(true)} />
      <Sidebar open={open} setOpen={setOpen} />

      
      <main className="py-20 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
