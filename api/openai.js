// api/openai.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Access your API key from environment variables
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.prompt,
        max_tokens: 100,
      });
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}