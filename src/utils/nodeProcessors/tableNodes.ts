
import { FlowNodeWithData } from '@/types/flow';

export const processReadTableNode = (node: FlowNodeWithData) => {
  const { tableName, columnName, readMode = 'sequential' } = node.data.settings || {};
  return `
    // Read data from table via API
    console.log('Reading from table:', "${tableName}", 'column:', "${columnName}", 'mode:', "${readMode}");
    
    let response;
    // Handle both table name and table ID
    const tableIdentifier = "${tableName}";
    
    if (tableIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // It's a UUID, query by ID
      console.log('Querying table by ID:', tableIdentifier);
      response = await fetch(\`\${process.env.SUPABASE_URL}/rest/v1/custom_tables?id=eq.\${tableIdentifier}\`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`,
          'apikey': process.env.SUPABASE_ANON_KEY
        }
      });
    } else {
      // It's a name, use the original function endpoint
      console.log('Querying table by name:', tableIdentifier);
      response = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-operations/read\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`
        },
        body: JSON.stringify({
          tableName: "${tableName}",
          columnName: "${columnName}",
          readMode: "${readMode}"
        })
      });
    }

    if (!response.ok) {
      const error = await response.json();
      console.error('Error reading table:', error);
      throw new Error('Failed to read from table: ' + (error.error || 'Unknown error'));
    }

    const data = await response.json();
    
    if (data.value === null || data.value === undefined) {
      console.log(data.message || 'No value returned from table');
      return;
    }

    // Store the read value both in global state and node outputs
    global.lastTableRead = data.value;
    global.nodeOutputs["${node.id}"] = {
      value: data.value
    };
    console.log('Read value:', data.value);
  `;
};

export const processWriteTableNode = (node: FlowNodeWithData) => {
  const settings = node.data.settings || {};
  const tableName = settings.tableName || '';
  const columnName = settings.columnName || '';
  const writeMode = settings.writeMode || 'overwrite';
  const data = settings.data || '[]';

  return `
    // Write data to table
    console.log('Writing to table:', "${tableName}", 'column:', "${columnName}", 'mode:', "${writeMode}");
    let newData;
    try {
      newData = typeof ${data} === 'string' ? JSON.parse('${data}') : ${data};
    } catch (e) {
      console.error('Invalid data format:', e);
      throw new Error('Invalid data format. Data must be valid JSON array');
    }

    // Determine if tableName is an ID or a name
    const isUUID = "${tableName}".match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    let query;
    if (isUUID) {
      query = supabase
        .from('custom_tables')
        .update({ 
          data: newData,
          write_mode: "${writeMode}"
        })
        .eq('id', "${tableName}");
    } else {
      query = supabase
        .from('custom_tables')
        .update({ 
          data: newData,
          write_mode: "${writeMode}"
        })
        .eq('name', "${tableName}");
    }
    
    const { error } = await query;
    
    if (error) {
      console.error('Error writing to table:', error);
      throw error;
    }
    
    console.log('Successfully wrote data to table');
  `;
};
