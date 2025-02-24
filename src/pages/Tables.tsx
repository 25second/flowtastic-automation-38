
import { Route, Routes } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TablesList } from '@/components/tables/TablesList';
import { TableEditor } from '@/components/tables/TableEditor';
import { useAccentColor } from '@/hooks/useAccentColor';

export default function Tables() {
  // Apply accent color
  useAccentColor();

  return (
    <Routes>
      <Route index element={
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <DashboardSidebar onNewWorkflow={() => {}} />
            <TablesList />
          </div>
        </SidebarProvider>
      } />
      <Route path=":tableId" element={
        <div className="w-full h-screen">
          <TableEditor tableId={window.location.pathname.split('/').pop() || ''} />
        </div>
      } />
    </Routes>
  );
}
