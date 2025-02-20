
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { prompt, availableNodes, nebiusKey } = req.body;
  
  try {
    const response = await fetch('https://api.studio.nebius.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nebiusKey}`
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
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate flow');
    }

    const data = await response.json();
    const generatedFlow = JSON.parse(data.choices[0].message.content);
    res.json(generatedFlow);
  } catch (error) {
    console.error('Error in AI generation:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
