// api/mistral.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers if necessary
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle POST requests
  if (req.method === 'POST') {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      // Mistral API call
      const response = await fetch('https://api.mistral.ai/v1/generate', { // Update with the correct Mistral API endpoint
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`, // Use the environment variable for Mistral API Key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        res.status(200).json({ result: data }); // Adjust based on Mistral API response format
      } else {
        res.status(response.status).json({ error: data.error });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
