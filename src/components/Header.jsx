import { GiHamburgerMenu } from "react-icons/gi";

const Header = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="flex items-center gap-4 px-6 py-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <GiHamburgerMenu size={20} className="text-white" />
        </button>

        <h1 className="text-white font-medium tracking-wide">
          Chat Application
        </h1>
      </div>
    </header>
  );
};

export default Header;
