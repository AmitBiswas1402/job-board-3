import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex">
      <Image src="/logo.png" alt="" height={40} width={40} />
      <span className="text-xl font-semibold ml-0.5 mt-1.5 text-purple-800">ork Board</span>
    </div>
  );
};
export default Logo;
