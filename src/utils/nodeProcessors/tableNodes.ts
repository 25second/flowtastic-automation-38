
import { FlowNodeWithData } from '@/types/flow';

export const processReadTableNode = (node: FlowNodeWithData) => {
  const { tableName, limit = 10, offset = 0 } = node.data.settings || {};
  return `
    // Read data from table
    console.log('Reading from table:', "${tableName}");
    const { data: tableData, error } = await supabase
      .from('custom_tables')
      .select('data, cell_status')
      .eq('name', "${tableName}")
      .single();
    
    if (error) {
      console.error('Error reading table:', error.message);
      throw error;
    }
    
    // Mark cells as read
    const rows = tableData.data || [];
    const cellStatus = tableData.cell_status || Array(rows.length).fill(Array(rows[0]?.length || 0).fill(false));
    
    // Update cell status for read cells
    const newCellStatus = cellStatus.map((row: boolean[], rowIndex: number) => 
      row.map((cell: boolean, colIndex: number) => 
        rowIndex >= ${offset} && rowIndex < ${offset} + ${limit} ? true : cell
      )
    );

    // Update cell status in database
    const { error: updateError } = await supabase
      .from('custom_tables')
      .update({ cell_status: newCellStatus })
      .eq('name', "${tableName}");
    
    if (updateError) {
      console.error('Error updating cell status:', updateError.message);
    }

    const paginatedRows = rows.slice(${offset}, ${offset} + ${limit});
    global.lastTableRead = paginatedRows;
    console.log('Read table data:', paginatedRows);
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
