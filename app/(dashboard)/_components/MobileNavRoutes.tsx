import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const MobileNavRoutes = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>

      <SheetContent className="bg-white p-0" side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        </SheetHeader>

        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavRoutes;
