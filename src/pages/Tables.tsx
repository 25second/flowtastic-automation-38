
import { Route, Routes, useParams } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TablesList } from '@/components/tables/TablesList';
import { TableEditor } from '@/components/tables/TableEditor';
import { useAccentColor } from '@/hooks/useAccentColor';

// Wrapper component to get params and pass to TableEditor
function TableEditorWrapper() {
  const { tableId } = useParams();
  return <TableEditor tableId={tableId || ''} />;
}

export default function Tables() {
  // Apply accent color
  useAccentColor();

  return (
    <Routes>
      <Route index element={
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <DashboardSidebar onNewWorkflow={() => {}} />
            <div className="flex-1">
              <div className="container mx-auto py-8 space-y-6">
                <TablesList />
              </div>
            </div>
          </div>
        </SidebarProvider>
      } />
      <Route path=":tableId" element={<TableEditorWrapper />} />
    </Routes>
  );
}
