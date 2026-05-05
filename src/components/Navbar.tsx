import Users from "./Users";

const Navbar = () => {
  return (
    <header className="w-full flex justify-center px-4 pt-6 md:pt-8">
      <nav className="w-full max-w-6xl rounded-[24px] border border-[#d8d9e8] bg-white/90 px-4 py-3 shadow-[0_8px_28px_rgba(31,38,135,0.08)] backdrop-blur md:px-8 md:py-4">
        <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6C4CF1] text-base font-bold text-white">
            ✦
          </div>

          <h1 className="font-heading text-xl font-bold tracking-tight text-[#111322] md:text-[28px]">
            VidMotionAI
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden items-center gap-10 text-[15px] font-semibold text-[#4b4f67] md:flex">
          <a href="#" className="transition hover:text-[#111322]">
            Home
          </a>

          <a href="#" className="transition hover:text-[#111322]">
            Pricing
          </a>

          <a href="#" className="transition hover:text-[#111322]">
            Contact Us
          </a>
        </div>

        {/* Auth Button */}
        <Users />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;