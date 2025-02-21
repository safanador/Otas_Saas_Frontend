"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal, 
  Receipt,
  Users,
  Puzzle,
  House,
  Store,
} from "lucide-react"

//import { NavMain } from "@/components/nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { Skeleton } from "@/components/ui/skeleton"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Inicio",
      titleEn: "user",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Usuarios",
      titleEn: "user",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Listar",
          url: "/admin/users/list",
          permission: "list user",
        },
        {
          title: "Crear",
          url: "/admin/users/create",
          permission: "create user",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Roles",
      titleEn: "role",
      url: "#",
      icon: Puzzle,
      items: [
        {
          title: "Listar Roles",
          url: "/admin/roles/list",
          permission: "list role",
        },
        {
          title: "Crear Roles",
          url: "/admin/roles/create",
          permission: "create role",
        },
      ],
    },
    {
      title: "Agencias",
      titleEn: "agency",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Listar",
          url: "/admin/agency/list",
          permission: "list agency",
        },
        {
          title: "Crear",
          url: "/admin/agency/create",
          permission: "create agency",
        },
        /**
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        }, */
      ],
    },
    {
      title: "Planes",
      titleEn: "plan",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Listar",
          url: "/admin/plans/list",
          permission: "list plan",
        },
        {
          title: "Crear",
          url: "/admin/plans/create",
          permission: "create plan",
        },
      ],
    },
    {
      title: "Suscripciones",
      titleEn: "subscription",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Listar",
          url: "/admin/subscriptions/list",
          permission: "list subscription",
        },
        {
          title: "Crear",
          url: "/admin/subscriptions/create",
          permission: "create subscription",
        },
      ],
    },
    {
      title: "Pagos",
      titleEn: "payment",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "Listar",
          url: "/admin/payments/list",
          permission: "list payment",
        },
        {
          title: "Crear",
          url: "/admin/payments/create",
          permission: "create payment",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Partners",
      url: "#",
      icon: Frame,
    },
    {
      name: "Ventas & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Reservas Online",
      url: "#",
      icon: Map,
    },
  ],
}

const isBrowser = typeof window !== "undefined";

export function AppSidebar({ ...props }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (isBrowser) {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (!storedUser) {
        window.location.href = '/auth/login';
      }
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} user={user} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : 
        <div className="flex items-center space-x-4 p-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}