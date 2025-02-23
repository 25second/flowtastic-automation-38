
import { FlowNodeWithData } from '@/types/flow';

export const processReadTableNode = (node: FlowNodeWithData) => {
  const { tableId, limit = 10, offset = 0 } = node.data.settings || {};
  return `
    // Read data from table
    console.log('Reading from table:', "${tableId}");
    const { data: tableData, error } = await supabase
      .from('custom_tables')
      .select('data')
      .eq('id', "${tableId}")
      .single();
    
    if (error) {
      console.error('Error reading table:', error.message);
      throw error;
    }
    
    const rows = tableData.data || [];
    const paginatedRows = rows.slice(${offset}, ${offset} + ${limit});
    global.lastTableRead = paginatedRows;
    console.log('Read table data:', paginatedRows);
  `;
};

export const processWriteTableNode = (node: FlowNodeWithData) => {
  const { tableId, data = '[]' } = node.data.settings || {};
  return `
    // Write data to table
    console.log('Writing to table:', "${tableId}");
    let newData;
    try {
      newData = typeof ${data} === 'string' ? JSON.parse('${data}') : ${data};
    } catch (e) {
      console.error('Invalid data format:', e);
      throw new Error('Invalid data format. Data must be valid JSON array');
    }

    const { error } = await supabase
      .from('custom_tables')
      .update({ data: newData })
      .eq('id', "${tableId}");
    
    if (error) {
      console.error('Error writing to table:', error.message);
      throw error;
    }
    
    console.log('Successfully wrote data to table');
  `;
};
