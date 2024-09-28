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

    console.log(messages)

    const apiKey = process.env.MISTRAL_API_KEY;
    const client = new Mistral({ apiKey });

    try {
      console.log("attempting api call.")

      // Mistral API call
      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",  // Adjust the model name if necessary
        messages,
      });

      console.log(chatResponse)

      res.status(200).json({ result: chatResponse });
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
