"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Library, School } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { href: "/", title: "Asosiy", icon: Home },
  { href: "/classes", title: "Sinflar", icon: Users },
  { href: "/subjects", title: "Fanlar", icon: Library },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <School className="size-7 text-sidebar-foreground" />
          <h1 className="text-xl font-bold tracking-tight">Kundalik</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href} className="px-2">
                <Link href={item.href} className="w-full">
                  <SidebarMenuButton
                    isActive={isActive}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
