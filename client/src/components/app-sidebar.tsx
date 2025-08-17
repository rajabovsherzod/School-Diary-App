"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
// School ikonasi bu yerdan olib tashlandi
import { Home, Users, Library, CalendarDays } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", title: "Asosiy", icon: Home },
  { href: "/classes", title: "Sinflar", icon: Users },
  { href: "/subjects", title: "Fanlar", icon: Library },
  { href: "/schedules", title: "Dars jadvallari", icon: CalendarDays },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar
      className={cn(
        "hidden border-r bg-sidebar text-sidebar-foreground md:block",
        className
      )}
    >
      <SidebarHeader className="flex h-14 items-center justify-center border-b border-sidebar-border px-4">
        <h1 className="text-xl font-bold tracking-tight">School Diary</h1>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href} className="px-2">
                <Link
                  href={item.href}
                  className="w-full"
                  onClick={() => setOpenMobile(false)}
                >
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
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
