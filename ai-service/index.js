import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

dotenv.config();

const app = express();
// Increase limit to handle large base64 image strings
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Initialize Google GenAI (Ensure GOOGLE_API_KEY is set in your .env file)
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const SYSTEM_PROMPT = `You are 'CampusQuest AI', an impartial judge for a campus scavenger hunt.
Your job is to evaluate user-submitted photos against a specific set of rules.
Analyze the image carefully. You must return your decision STRICTLY in the following JSON format without any markdown wrappers:
{
  "score": <integer 0-100>,
  "feedback": "<short explanation>"
}`;

app.post('/api/evaluate', async (req, res) => {
  try {
    const { quest_title, quest_description, rules, image_base64 } = req.body;

    if (!image_base64) {
      return res.status(400).json({ error: 'image_base64 is required' });
    }

    // Strip the data:image/jpeg;base64, prefix if it exists
    let base64Data = image_base64;
    let mimeType = "image/jpeg";
    if (image_base64.startsWith('data:')) {
      const matches = image_base64.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }
    }

    // Format rules appropriately if it's an array
    let formattedRules = rules;
    if (Array.isArray(rules)) {
      formattedRules = rules.map(r => `- ${r}`).join('\n');
    }

    const userPrompt = `Quest Title: ${quest_title}\nQuest Description: ${quest_description}\nRules to enforce:\n${formattedRules}\n\nPlease evaluate the attached image and score it from 0 to 100 based on rule adherence and photo quality.`;

    // Save base64 to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `quest_upload_${Date.now()}.jpg`);
    fs.writeFileSync(tempFilePath, base64Data, 'base64');

    // Upload to Google GenAI using the provided API
    const myfile = await ai.files.upload({
      file: tempFilePath,
      config: { mimeType: mimeType },
    });

    // Generate content
    const response = await ai.models.generateContent({
      model: "gemma-4-31b-it",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // lower temperature for more deterministic evaluations
      },
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        userPrompt,
      ]),
    });

    // Clean up the temporary file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temp file:', cleanupError);
    }
    
    // Extract and parse response
    let resultText = response.text.trim();
    
    // Safety check: remove markdown code blocks if the AI still included them
    if (resultText.startsWith('```json')) {
      resultText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (resultText.startsWith('```')) {
      resultText = resultText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const parsedResult = JSON.parse(resultText);

    // Send back the score and feedback
    res.json(parsedResult);

  } catch (error) {
    console.error('Error evaluating image:', error);
    res.status(500).json({ error: 'Failed to evaluate image', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CampusQuest AI Microservice running on port ${PORT}`);
  console.log(`Ready to receive POST requests at http://localhost:${PORT}/api/evaluate`);
});
