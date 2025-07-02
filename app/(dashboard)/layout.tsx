import Navbar from "@/components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <header className="h-20 fixed inset-y-0 w-full z-50">
        <Navbar />
      </header>

      <div>Sidebar</div>

      <main>{children}</main>
    </div>
  );
};
export default DashboardLayout;
