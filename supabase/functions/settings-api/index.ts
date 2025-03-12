
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.33.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Get the request URL
  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);
  
  // This endpoint is accessed via /settings-api/default-provider
  if (path[1] === 'default-provider') {
    return await getDefaultProvider(req);
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

async function getDefaultProvider(req: Request) {
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the default AI provider from the settings table
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'default_ai_provider')
      .single();

    if (error) {
      console.error('Error fetching default provider:', error);
      return new Response(
        JSON.stringify({
          provider: { provider: 'OpenAI', model: 'gpt-4o-mini' },
          error: error.message,
        }),
        {
          status: 200, // Return 200 even with error so the UI doesn't break
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        provider: data?.value || { provider: 'OpenAI', model: 'gpt-4o-mini' },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        provider: { provider: 'OpenAI', model: 'gpt-4o-mini' },
        error: error.message,
      }),
      {
        status: 200, // Return 200 even with error so the UI doesn't break
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
