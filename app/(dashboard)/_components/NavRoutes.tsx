"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

const NavRoutes = () => {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="flex gap-x-2 ml-auto">
        <UserButton afterSignOutUrl="/" />
    </div>
  )
}
export default NavRoutes