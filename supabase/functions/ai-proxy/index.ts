
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, method, headers, body } = await req.json();
    
    console.log(`Proxying request to: ${url}`);
    console.log(`Method: ${method}`);

    // Prepare headers for the proxied request
    const proxyHeaders = new Headers();
    
    // Copy headers from the original request
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          proxyHeaders.append(key, value);
        }
      });
    }

    // Make the proxied request
    const proxyOptions = {
      method: method || 'GET',
      headers: proxyHeaders,
    };
    
    // Add body for non-GET requests if provided
    if (method !== 'GET' && body) {
      proxyOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const proxyResponse = await fetch(url, proxyOptions);
    
    // Get response data
    const responseData = await proxyResponse.text();
    let contentType = proxyResponse.headers.get('content-type') || 'application/json';
    
    console.log(`Proxy response status: ${proxyResponse.status}`);
    
    // Return the proxied response with CORS headers
    return new Response(responseData, {
      status: proxyResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType
      },
    });
    
  } catch (error) {
    console.error('Error in ai-proxy function:', error);
    
    return new Response(JSON.stringify({
      error: 'Proxy request failed',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
