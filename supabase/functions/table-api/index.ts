
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TableRequest {
  tableId?: string;
  tableName?: string;
  columns?: string[];
  data?: any;
  filter?: {
    column: string;
    value: any;
    operator?: string; // 'eq', 'neq', 'gt', 'lt', etc.
  }[];
  limit?: number;
  offset?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    // Parse the request body
    const requestData: TableRequest = await req.json()
    console.log('Request data:', requestData)

    // Extract the operation from the URL
    const url = new URL(req.url)
    const operation = url.pathname.split('/').pop()
    
    switch (operation) {
      case 'get-table':
        return await getTable(supabaseClient, requestData, corsHeaders)
      case 'get-tables':
        return await getTables(supabaseClient, corsHeaders)
      case 'write-table':
        return await writeTable(supabaseClient, requestData, corsHeaders)
      case 'create-table':
        return await createTable(supabaseClient, requestData, corsHeaders)
      case 'delete-table':
        return await deleteTable(supabaseClient, requestData, corsHeaders)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})

async function getTable(supabaseClient, requestData: TableRequest, corsHeaders) {
  const { tableId, tableName, columns, filter, limit = 100, offset = 0 } = requestData

  if (!tableId && !tableName) {
    return new Response(
      JSON.stringify({ error: 'Either tableId or tableName must be provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  let query = supabaseClient.from('custom_tables')
  
  if (tableId) {
    query = query.eq('id', tableId)
  } else if (tableName) {
    query = query.eq('name', tableName)
  }

  const { data: tableData, error: tableError } = await query.select('*').single()

  if (tableError) {
    console.error('Error fetching table:', tableError)
    return new Response(
      JSON.stringify({ error: 'Table not found', details: tableError }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Apply filters to the data if needed
  let filteredData = tableData.data || []
  
  if (filter && filter.length > 0) {
    filteredData = filteredData.filter(row => {
      return filter.every(f => {
        const operator = f.operator || 'eq'
        const columnIndex = tableData.columns.findIndex(col => col.name === f.column)
        
        if (columnIndex === -1) return false
        
        const value = row[columnIndex]
        
        switch (operator) {
          case 'eq': return value === f.value
          case 'neq': return value !== f.value
          case 'gt': return value > f.value
          case 'lt': return value < f.value
          case 'gte': return value >= f.value
          case 'lte': return value <= f.value
          case 'contains': return String(value).includes(f.value)
          default: return value === f.value
        }
      })
    })
  }
  
  // Apply pagination
  const paginatedData = filteredData.slice(offset, offset + limit)
  
  // Select only requested columns if specified
  let responseData = {
    id: tableData.id,
    name: tableData.name,
    columns: tableData.columns,
    data: paginatedData,
    total: filteredData.length,
    limit,
    offset
  }
  
  return new Response(
    JSON.stringify(responseData),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
}

async function getTables(supabaseClient, corsHeaders) {
  const { data, error } = await supabaseClient
    .from('custom_tables')
    .select('id, name, description, created_at, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tables:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tables', details: error }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  return new Response(
    JSON.stringify(data),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
}

async function writeTable(supabaseClient, requestData: TableRequest, corsHeaders) {
  const { tableId, tableName, data } = requestData

  if (!tableId && !tableName) {
    return new Response(
      JSON.stringify({ error: 'Either tableId or tableName must be provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Data is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  let query = supabaseClient.from('custom_tables')
  
  if (tableId) {
    query = query.eq('id', tableId)
  } else if (tableName) {
    query = query.eq('name', tableName)
  }

  const { data: tableData, error: tableError } = await query.select('*').single()

  if (tableError) {
    console.error('Error fetching table:', tableError)
    return new Response(
      JSON.stringify({ error: 'Table not found', details: tableError }),
      { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Update the table data
  const { error: updateError } = await supabaseClient
    .from('custom_tables')
    .update({ 
      data: data,
      updated_at: new Date().toISOString()
    })
    .eq('id', tableData.id)

  if (updateError) {
    console.error('Error updating table:', updateError)
    return new Response(
      JSON.stringify({ error: 'Failed to update table', details: updateError }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Table data updated successfully',
      tableId: tableData.id 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
}

async function createTable(supabaseClient, requestData: TableRequest, corsHeaders) {
  const { tableName, data, columns } = requestData

  if (!tableName) {
    return new Response(
      JSON.stringify({ error: 'Table name is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Check if the table already exists
  const { data: existingTable, error: checkError } = await supabaseClient
    .from('custom_tables')
    .select('id')
    .eq('name', tableName)

  if (checkError) {
    console.error('Error checking table existence:', checkError)
    return new Response(
      JSON.stringify({ error: 'Failed to check if table exists', details: checkError }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  if (existingTable && existingTable.length > 0) {
    return new Response(
      JSON.stringify({ error: 'Table with this name already exists' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  // Create default columns if not provided
  const tableColumns = columns || [
    { id: crypto.randomUUID(), name: 'Column 1', type: 'text' },
    { id: crypto.randomUUID(), name: 'Column 2', type: 'text' },
    { id: crypto.randomUUID(), name: 'Column 3', type: 'text' }
  ]

  // Create empty data if not provided
  const tableData = data || [Array(tableColumns.length).fill('')]

  const { data: createdTable, error } = await supabaseClient
    .from('custom_tables')
    .insert({
      name: tableName,
      description: requestData.tableName || '',
      columns: tableColumns,
      data: tableData
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating table:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to create table', details: error }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Table created successfully',
      table: createdTable 
    }),
    { status: 201, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
}

async function deleteTable(supabaseClient, requestData: TableRequest, corsHeaders) {
  const { tableId, tableName } = requestData

  if (!tableId && !tableName) {
    return new Response(
      JSON.stringify({ error: 'Either tableId or tableName must be provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  let query = supabaseClient.from('custom_tables')
  
  if (tableId) {
    query = query.eq('id', tableId)
  } else if (tableName) {
    query = query.eq('name', tableName)
  }

  const { error } = await query.delete()

  if (error) {
    console.error('Error deleting table:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete table', details: error }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }

  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Table deleted successfully' 
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  )
}
