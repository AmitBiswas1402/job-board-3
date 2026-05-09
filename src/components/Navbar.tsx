import Users from "./Users";

const Navbar = () => {
  return (
    <header className="w-full flex justify-center pt-2">
      <nav className="w-full max-w-6xl rounded-[28px] border border-[#ece8ff] bg-white px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C4CF1] text-white shadow-sm">
              ✦
            </div>

            <h1 className="text-[30px] font-extrabold tracking-[-0.03em] text-[#111322]">
              VidMotionAI
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-12 text-[16px] font-semibold text-[#4b4f67]">
            <a href="#" className="transition hover:text-black">
              Home
            </a>

            <a href="#" className="transition hover:text-black">
              Pricing
            </a>

            <a href="#" className="transition hover:text-black">
              Contact Us
            </a>
          </div>

          {/* CTA */}
          <Users />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;