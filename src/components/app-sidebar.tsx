"use client";

import * as React from "react";
import {
  Home,
  Zap,
  Truck,
  Heart,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Flash Sale", url: "#flash-sale", icon: Zap },
  { title: "Track Order", url: "#", icon: Truck },
  { title: "My Wishlist", url: "#", icon: Heart },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background" {...props}>
      <SidebarHeader className="h-28 flex flex-col items-start justify-center px-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/10 border border-white/5">
            <span className="text-background font-black text-4xl tracking-tighter">SS</span>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-headline font-bold text-xl leading-none tracking-tight text-primary uppercase">
              SS SMART HAAT
            </span>
            <span className="text-[10px] text-white/90 uppercase tracking-[0.2em] mt-1.5 font-bold">Premium Store</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4 pt-8">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-bold uppercase tracking-[0.2em] text-[11px] mb-6 px-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-primary/5 hover:text-primary py-7 rounded-2xl transition-all duration-300">
                    <a href={item.url} className="flex items-center gap-4">
                      <item.icon className="h-6 w-6" />
                      <span className="font-bold text-base text-white">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        <div className="flex items-center gap-4 group-data-[collapsible=icon]:justify-center bg-primary/5 p-4 rounded-[24px] border border-primary/10">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-background shadow-md">
              <AvatarImage src="https://picsum.photos/seed/user1/100/100" />
              <AvatarFallback className="bg-primary text-background font-bold">ZR</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-card rounded-full flex items-center justify-center border-2 border-background shadow-sm">
              <span className="text-[10px] font-bold text-white">N</span>
            </div>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-base font-bold text-white">Zubair Rahman</span>
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Premium Member</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
