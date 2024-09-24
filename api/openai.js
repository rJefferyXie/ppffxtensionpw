// api/openai.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your API key from environment variables
});

export default async function handler(req, res) {
  // Set CORS headers if necessary
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle POST requests
  if (req.method === 'POST') {
    const { prompt } = req.body; // Extract prompt from request body
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      // Call OpenAI API with the prompt
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Or "text-davinci-003" if you need a specific model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100,
      });

      // Send the result back to the client
      res.status(200).json(response);
    } catch (error) {
      // Handle error
      res.status(500).json({ error: error.message });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
