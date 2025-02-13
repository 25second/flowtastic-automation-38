
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { prompt, availableNodes } = await req.json();

    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('NEBIUS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates workflow automation scripts based on user prompts.
            Available node types: ${JSON.stringify(availableNodes)}.
            Generate a JSON response with nodes and edges that can be used with React Flow.
            Response format:
            {
              "nodes": [
                {
                  "id": string,
                  "type": string (must be one of available node types),
                  "data": { "label": string, "settings": object },
                  "position": { "x": number, "y": number }
                }
              ],
              "edges": [
                {
                  "id": string,
                  "source": string (node id),
                  "target": string (node id)
                }
              ]
            }`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.6,
        top_p: 0.9,
        extra_body: {
          top_k: 50
        }
      }),
    });

    const data = await response.json();
    const generatedFlow = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(generatedFlow), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-with-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
