
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const playwrightTools = [
  {
    name: "click",
    description: "Click an element on the page",
    parameters: {
      selector: "CSS selector or description of the element to click"
    }
  },
  {
    name: "type",
    description: "Type text into an input field",
    parameters: {
      selector: "CSS selector or description of the input field",
      text: "Text to type"
    }
  },
  {
    name: "navigate",
    description: "Navigate to a URL",
    parameters: {
      url: "URL to navigate to"
    }
  },
  {
    name: "extract",
    description: "Extract text from an element",
    parameters: {
      selector: "CSS selector or description of the element"
    }
  }
];

const systemPrompt = `You are an AI assistant that helps convert natural language instructions into Playwright actions.
Available tools: ${JSON.stringify(playwrightTools, null, 2)}
Always respond with a JSON object containing:
1. tool: the name of the tool to use
2. parameters: the parameters for the tool
3. explanation: why you chose this tool and how you determined the parameters`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, pageContent } = await req.json();

    console.log('Received action:', action);
    console.log('Page content length:', pageContent?.length || 0);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Page content: ${pageContent}\n\nAction to perform: ${action}` }
        ],
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI Response:', aiResponse);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-action function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
