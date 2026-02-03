
"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LayoutDashboard, Users, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPanel() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
            <LayoutDashboard className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-headline font-bold uppercase tracking-tight">Admin Control Panel</h1>
            <p className="text-muted-foreground text-sm font-medium">Manage your boutique marketplace and track performance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Sales", value: "$24,560", icon: BarChart3, color: "text-blue-500" },
            { title: "New Orders", value: "48", icon: ShoppingBag, color: "text-emerald-500" },
            { title: "Active Users", value: "1,240", icon: Users, color: "text-amber-500" },
            { title: "Inventory", value: "854 Items", icon: Settings, color: "text-rose-500" }
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-primary/10 hover:border-primary/30 transition-all rounded-3xl overflow-hidden group shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-headline">{stat.value}</div>
                <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">+12% from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8">
           <Card className="rounded-[32px] border-primary/10 shadow-sm p-12 text-center bg-primary/5">
              <h2 className="text-2xl font-bold mb-4">Store Management</h2>
              <p className="text-muted-foreground">Product and order management features are coming soon to this dashboard.</p>
           </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
