
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-auto">
          <h1 className="text-3xl font-bold mb-6">Payments</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>This page is under development</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center">
              <p className="text-muted-foreground">Payments functionality will be implemented soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
