"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavRoutes = () => {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isEmp = pathname.startsWith("/jobs");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isAdmin || isEmp ? (
        <Link href={"/"}>
          <Button
            variant={"outline"}
            size={"sm"}
            className="border-purple-700/20"
          >
            <LogOut />
            Exit
          </Button>
        </Link>
      ) : (
        <>
          <Link href={"/admin/jobs"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              Admin Mode
            </Button>
          </Link>
        </>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
export default NavRoutes;
