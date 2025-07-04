"use client"

import { BookMarked, Compass, Home, List, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import SidebarRouteItem from "./SidebarRouteItem"

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs"
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies"
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics"
  },
]

const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/"
  },
  {
    icon: Compass,
    label: "Search",
    href: "/search"
  },
  {
    icon: User,
    label: "Profile",
    href: "/user"
  },
  {
    icon: BookMarked,
    label: "Saved Jobs",
    href: "/savedJobs"
  },
]

const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin")

  const routes = isAdminPage ? adminRoutes : guestRoutes;

  return (
    <div>
      {routes.map((route) => (
        <SidebarRouteItem key={route.href} />
      ))}
    </div>
  )
}

export default SidebarRoutes