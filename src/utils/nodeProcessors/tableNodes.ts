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
      response = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-api\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`,
          'apikey': process.env.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          tableId: tableIdentifier,
          operation: 'get-table'
        })
      });
    } else {
      // It's a name, use the table name
      console.log('Querying table by name:', tableIdentifier);
      response = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-api\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`,
          'apikey': process.env.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          tableName: tableIdentifier,
          operation: 'get-table'
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
    
    const response = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-api\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`,
        'apikey': process.env.SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        tableId: isUUID ? "${tableName}" : null,
        tableName: !isUUID ? "${tableName}" : null,
        data: newData,
        operation: 'write-table'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error writing to table:', error);
      throw new Error('Failed to write to table: ' + (error.error || 'Unknown error'));
    }
    
    const result = await response.json();
    console.log('Successfully wrote data to table:', result);
  `;
};

export const processWebSearchTableNode = (node: FlowNodeWithData) => {
  const settings = node.data.settings || {};
  const tableName = settings.tableName || '';
  const query = settings.query || '';
  const bearerToken = process.env.TESSA_BEARER_TOKEN;

  return `
    // Web search with table integration
    console.log('Performing web search and table operation for query:', "${query}");
    
    const performWebSearch = async () => {
      const keys_to_use = ['url', 'title', 'content', 'author', 'score'];
      
      const response = await fetch('https://asktessa.ai/api/search', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${process.env.TESSA_BEARER_TOKEN}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: "${query}" })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      const finalResults = data.sources
        .filter(source => source.score >= 0.8)
        .map(source => {
          const result = {};
          keys_to_use.forEach(key => {
            if (key in source) {
              result[key] = source[key];
            }
          });
          return result;
        });

      // Store results in the specified table
      const tableResponse = await fetch(\`\${process.env.SUPABASE_URL}/functions/v1/table-api\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.SUPABASE_ANON_KEY}\`,
          'apikey': process.env.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          tableName: "${tableName}",
          data: finalResults,
          operation: 'write-table'
        })
      });

      if (!tableResponse.ok) {
        const error = await tableResponse.json();
        throw new Error('Failed to write to table: ' + (error.error || 'Unknown error'));
      }

      const result = await tableResponse.json();
      console.log('Successfully wrote search results to table:', result);
      
      return {
        searchResults: finalResults,
        tableWriteResult: result
      };
    };

    try {
      const result = await performWebSearch();
      global.nodeOutputs["${node.id}"] = result;
      console.log('Search and table operation completed successfully');
    } catch (error) {
      console.error('Error in web search and table operation:', error);
      throw error;
    }
  `;
};
