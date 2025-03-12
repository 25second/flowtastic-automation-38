
import React, { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Badge } from "@/components/ui/badge";

interface AIProvidersLayoutProps {
  children: ReactNode;
  role: string | null;
}

export function AIProvidersLayout({ children, role }: AIProvidersLayoutProps) {
  return (
    <div className="w-full">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex-1 p-8 overflow-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">AI Providers</h1>
              <Badge variant="outline" className="px-3 py-1">
                Role: {role || 'Loading...'}
              </Badge>
            </div>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
