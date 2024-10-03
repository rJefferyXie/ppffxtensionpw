// api/mistral.js
import { Mistral } from '@mistralai/mistralai';

export default async function handler(req, res) {
  // Set CORS headers if necessary
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle POST requests
  if (req.method === 'POST') {
    const { messages } = req.body;
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const apiKey = process.env.MISTRAL_API_KEY;
    const client = new Mistral({ apiKey });

    try {
      // Set up the headers for streaming
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Mistral API call
      const chatResponse = await client.chat.stream({
        model: "mistral-large-latest",  // Adjust the model name if necessary
        messages: messages,
      });

      for await (const chunk of chatResponse) {
        const streamText = chunk.data.choices[0].delta.content;
        res.write(streamText);
      }

      res.end()

    } catch (error) {
      console.log(error)
      console.error("Error calling Mistral API:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
