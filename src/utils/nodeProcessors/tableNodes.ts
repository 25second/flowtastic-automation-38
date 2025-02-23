
import { FlowNodeWithData } from '@/types/flow';

export const processReadTableNode = (node: FlowNodeWithData) => {
  const { tableName, columnName, readMode = 'sequential' } = node.data.settings || {};
  return `
    // Read data from table
    console.log('Reading from table:', "${tableName}", 'column:', "${columnName}", 'mode:', "${readMode}");
    
    const { data: tableData, error } = await supabase
      .from('custom_tables')
      .select('data, columns, cell_status')
      .eq('name', "${tableName}")
      .single();
    
    if (error) {
      console.error('Error reading table:', error.message);
      throw error;
    }

    // Get column index
    const columnIndex = tableData.columns.findIndex(col => col.name === "${columnName}");
    if (columnIndex === -1) {
      throw new Error(\`Column "\${columnName}" not found in table "\${tableName}"\`);
    }

    // Initialize variables
    const rows = tableData.data || [];
    const cellStatus = tableData.cell_status || Array(rows.length).fill(Array(rows[0]?.length || 0).fill(false));
    let selectedRow = -1;
    let selectedValue = null;

    if ("${readMode}" === 'random') {
      // Get all unread rows for this column
      const unreadRows = rows.map((row, index) => ({
        index,
        value: row[columnIndex]
      })).filter((row, index) => !cellStatus[index][columnIndex]);

      if (unreadRows.length > 0) {
        // Select random unread row
        const randomIndex = Math.floor(Math.random() * unreadRows.length);
        selectedRow = unreadRows[randomIndex].index;
        selectedValue = unreadRows[randomIndex].value;
      }
    } else {
      // Sequential mode - find first unread row
      selectedRow = cellStatus.findIndex((row) => !row[columnIndex]);
      if (selectedRow !== -1) {
        selectedValue = rows[selectedRow][columnIndex];
      }
    }

    if (selectedRow === -1) {
      console.log('No unread cells found in column');
      return;
    }

    // Update cell status for the read cell
    const newCellStatus = cellStatus.map((row, rowIndex) =>
      rowIndex === selectedRow
        ? row.map((cell, colIndex) => colIndex === columnIndex ? true : cell)
        : row
    );

    // Update cell status in database
    const { error: updateError } = await supabase
      .from('custom_tables')
      .update({ cell_status: newCellStatus })
      .eq('name', "${tableName}");
    
    if (updateError) {
      console.error('Error updating cell status:', updateError.message);
    }

    // Store the read value in global state
    global.lastTableRead = selectedValue;
    console.log('Read value:', selectedValue);
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
