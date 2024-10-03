// api/mistral.js
import express from 'express';
import { Mistral } from '@mistralai/mistralai';

const app = express();
const PORT = process.env.PORT || 3000;  // Use Render's port or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Set CORS headers if necessary
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle POST requests for /api/mistral
app.post('/api/mistral', async (req, res) => {
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

    res.end();
  } catch (error) {
    console.error("Error calling Mistral API:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});