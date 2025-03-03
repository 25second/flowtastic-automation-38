
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserTablesWithPython } from '@/utils/python/tableScripts';
import { toast } from 'sonner';
import { isElectronApp } from '@/electron';

const PythonTableFetcher = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = async () => {
    if (!isElectronApp) {
      toast.error('This feature is only available in desktop app');
      return;
    }

    setLoading(true);
    try {
      const tablesData = await getUserTablesWithPython();
      setTables(tablesData);
      toast.success(`Successfully fetched ${tablesData.length} tables`);
    } catch (error) {
      console.error('Error fetching tables with Python:', error);
      toast.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fetch Tables with Python</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={fetchTables} 
            disabled={loading || !isElectronApp}
          >
            {loading ? 'Loading...' : 'Fetch Tables with Python'}
          </Button>
          
          {!isElectronApp && (
            <p className="text-sm text-yellow-600">
              This feature requires the desktop application.
            </p>
          )}
          
          {tables.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tables ({tables.length})</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table) => (
                      <tr key={table.id} className="border-t">
                        <td className="px-4 py-2">{table.name}</td>
                        <td className="px-4 py-2">{table.description || '-'}</td>
                        <td className="px-4 py-2">
                          {new Date(table.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonTableFetcher;
