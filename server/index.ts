import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Load prompts and tools
const agentPrompt = fs.readFileSync(path.join(__dirname, '..', 'Agent Prompt.txt'), 'utf-8');
const prompt = fs.readFileSync(path.join(__dirname, '..', 'Prompt.txt'), 'utf-8');
const agentTools = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'Agent Tools.json'), 'utf-8'));

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the loved server!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      systemInstruction: `${agentPrompt}\n\n${prompt}`,
      tools: [{ functionDeclarations: agentTools }],
    });

    const chat = model.startChat({
      history: history || [],
    });

    let result = await chat.sendMessage(message);
    let response = await result.response;

    let functionCalls = response.functionCalls;

    if (functionCalls && !Array.isArray(functionCalls)) {
        functionCalls = [functionCalls];
    }

    if (functionCalls) {
      const toolResults = [];

      for (const call of functionCalls) {
        if (call.name === 'lov-write') {
          const { file_path, content } = call.args;

          const livePreviewDir = path.resolve(__dirname, '..', 'live-preview-app');
          const filePath = path.resolve(livePreviewDir, file_path);

          // Security check
          if (!filePath.startsWith(livePreviewDir)) {
            throw new Error('File path is outside the allowed directory.');
          }

          fs.writeFileSync(filePath, content);
          toolResults.push({
            functionResponse: {
              name: 'lov-write',
              response: { success: true, message: `File ${file_path} written successfully.` },
            },
          });
        }
      }

      result = await chat.sendMessage(JSON.stringify(toolResults));
      response = await result.response;
    }

    const text = response.text();
    res.json({ response: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
