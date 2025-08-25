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

// Load tools
const agentTools = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'Agent Tools.json'), 'utf-8'));

const systemPrompt = `
You are an expert AI coding assistant named "Lovable". Your purpose is to help users create and modify web applications.

When a user asks you to make a change to the code, you must use the provided tools to write the code changes to the appropriate files.

For example, if a user asks you to "change the title to 'Hello'", you should call the \`lov-write\` tool with the correct file path and the new content for the file.

For general conversation, you should respond as a friendly and helpful assistant.
`;

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the loved server!');
});

app.post('/api/chat', async (req, res) => {
  try {
    console.log('--- NEW CHAT REQUEST ---');
    const { message, history } = req.body;
    console.log('Received message:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      systemInstruction: systemPrompt,
      tools: [{ functionDeclarations: agentTools }],
    });

    const chat = model.startChat({
      history: history || [],
    });

    console.log('Sending message to Gemini...');
    let result = await chat.sendMessage(message);
    let response = await result.response;
    console.log('--- Gemini Response 1 ---');
    console.log(JSON.stringify(response, null, 2));


    let functionCalls = response.functionCalls;

    if (functionCalls && !Array.isArray(functionCalls)) {
        console.log('Wrapping single function call in array');
        functionCalls = [functionCalls];
    }

    if (functionCalls) {
      console.log('Detected function calls:', functionCalls.length);
      const toolResults = [];

      for (const call of functionCalls) {
        console.log(`Executing tool: ${call.name}`);
        if (call.name === 'lov-write') {
          const { file_path, content } = call.args;
          console.log(`  > file_path: ${file_path}`);
          console.log(`  > content: "${content.substring(0, 50)}..."`);

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

      console.log('Tool results:', JSON.stringify(toolResults, null, 2));
      if (toolResults.length > 0) {
        console.log('Sending tool results back to Gemini...');
        result = await chat.sendMessage(toolResults);
        response = await result.response;
        console.log('--- Gemini Response 2 ---');
        console.log(JSON.stringify(response, null, 2));
      }
    }

    const text = response.text();
    console.log('Final text response:', text);
    console.log('--- END CHAT REQUEST ---');
    res.json({ response: text });

  } catch (error) {
    console.error('!!! CHAT API ERROR !!!');
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
