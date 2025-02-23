import { Route, Routes, useParams } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { TablesList } from '@/components/tables/TablesList';
import { TableEditor } from '@/components/tables/TableEditor';

function TableEditorWrapper() {
  const { tableId } = useParams();
  
  if (!tableId) {
    return <div>Table ID not found</div>;
  }

  return (
    <div className="w-full h-screen">
      <TableEditor tableId={tableId} />
    </div>
  );
}

export default function Tables() {
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
      <Route path=":tableId" element={<TableEditorWrapper />} />
    </Routes>
  );
}
