import { FlowNodeWithData } from '@/types/flow';

export const processReadTableNode = (node: FlowNodeWithData) => {
  const { tableName, columnName, readMode = 'sequential' } = node.data.settings || {};
  return `
    // Read data from table via API
    console.log('Reading from table:', "${tableName}", 'column:', "${columnName}", 'mode:', "${readMode}");
    
    const response = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-operations/read\`, {
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

    // Store the read value in global state
    global.lastTableRead = data.value;
    console.log('Read value:', data.value);
  `;
};

export const processWriteTableNode = (node: FlowNodeWithData) => {
  const { tableName, data = '[]' } = node.data.settings || {};
  return `
    // Write data to table
    console.log('Writing to table:', "${tableName}");
    let newData;
    try {
      newData = typeof ${data} === 'string' ? JSON.parse('${data}') : ${data};
    } catch (e) {
      console.error('Invalid data format:', e);
      throw new Error('Invalid data format. Data must be valid JSON array');
    }

    // Reset cell status for new data
    const newCellStatus = Array(newData.length).fill(Array(newData[0]?.length || 0).fill(false));

    const { error } = await supabase
      .from('custom_tables')
      .update({ 
        data: newData,
        cell_status: newCellStatus
      })
      .eq('name', "${tableName}");
    
    if (error) {
      console.error('Error writing to table:', error.message);
      throw error;
    }
    
    console.log('Successfully wrote data to table');
  `;
};
