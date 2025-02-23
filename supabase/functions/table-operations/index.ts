import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReadTableRequest {
  tableName: string;
  columnName: string;
  readMode: 'sequential' | 'random';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get request method and path
    const { pathname } = new URL(req.url)

    // Read table endpoint
    if (pathname === '/read' && req.method === 'POST') {
      const body: ReadTableRequest = await req.json()
      const { tableName, columnName, readMode } = body

      console.log('Reading table:', tableName, 'column:', columnName, 'mode:', readMode)

      // Get table data
      const { data: tableData, error: tableError } = await supabase
        .from('custom_tables')
        .select('data, columns, cell_status')
        .eq('name', tableName)
        .single()

      if (tableError) {
        console.error('Error fetching table:', tableError)
        return new Response(
          JSON.stringify({ error: tableError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get column index
      const columnIndex = tableData.columns.findIndex((col: any) => col.name === columnName)
      if (columnIndex === -1) {
        return new Response(
          JSON.stringify({ error: `Column "${columnName}" not found` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Initialize variables
      const rows = tableData.data || []
      const cellStatus = tableData.cell_status || Array(rows.length).fill(Array(rows[0]?.length || 0).fill(false))
      let selectedRow = -1
      let selectedValue = null

      if (readMode === 'random') {
        // Get all unread rows for this column
        const unreadRows = rows.map((row: any, index: number) => ({
          index,
          value: row[columnIndex]
        })).filter((row: any, index: number) => !cellStatus[index][columnIndex])

        if (unreadRows.length > 0) {
          // Select random unread row
          const randomIndex = Math.floor(Math.random() * unreadRows.length)
          selectedRow = unreadRows[randomIndex].index
          selectedValue = unreadRows[randomIndex].value
        }
      } else {
        // Sequential mode - find first unread row
        selectedRow = cellStatus.findIndex((row: any) => !row[columnIndex])
        if (selectedRow !== -1) {
          selectedValue = rows[selectedRow][columnIndex]
        }
      }

      if (selectedRow === -1) {
        return new Response(
          JSON.stringify({ message: 'No unread cells found in column' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Update cell status
      const newCellStatus = cellStatus.map((row: any, rowIndex: number) =>
        rowIndex === selectedRow
          ? row.map((cell: any, colIndex: number) => colIndex === columnIndex ? true : cell)
          : row
      )

      // Update cell status in database
      const { error: updateError } = await supabase
        .from('custom_tables')
        .update({ cell_status: newCellStatus })
        .eq('name', tableName)

      if (updateError) {
        console.error('Error updating cell status:', updateError)
      }

      return new Response(
        JSON.stringify({ value: selectedValue }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
