import MobileNavRoutes from "./MobileNavRoutes";
import NavRoutes from "./NavRoutes";

const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileNavRoutes /> 
      <NavRoutes />
    </div>
  );
};
export default Navbar;
