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
      url: "#",
      icon: Users,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Roles",
      url: "#",
      icon: Puzzle,
      items: [
        {
          title: "Listar Roles",
          url: "/admin/roles/list",
        },
        {
          title: "Crear Roles",
          url: "/admin/roles/create",
        },
        /**
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        }, */
      ],
    },
    {
      title: "Agencias",
      url: "#",
      icon: Store,
      items: [
        {
          title: "Listar",
          url: "/admin/list",
        },
        {
          title: "Crear",
          url: "/admin/create",
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
      title: "Suscripciones",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Pagos",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
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

export function AppSidebar({ ...props }) {

  //const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
