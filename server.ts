import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality, GenerateVideosOperation } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON body parser with increased limit for base64 image transfers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Helper to initialize GoogleGenAI safely with required User-Agent header
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // --- LYRIA MUSIC GENERATION API ---
  app.post('/api/generate-music', async (req, res) => {
    try {
      const { prompt, model = 'lyria-3-clip-preview', imageBase64, imageMimeType } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGenAI();
      const validModel = model === 'lyria-3-pro-preview' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';

      let contents: any;
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
        contents = {
          parts: [
            { text: prompt },
            { inlineData: { data: cleanBase64, mimeType: imageMimeType || 'image/jpeg' } }
          ]
        };
      } else {
        contents = prompt;
      }

      const streamResponse = await ai.models.generateContentStream({
        model: validModel,
        contents,
        config: {
          responseModalities: [Modality.AUDIO]
        }
      });

      let audioBase64 = '';
      let lyrics = '';
      let mimeType = 'audio/wav';

      for await (const chunk of streamResponse) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !lyrics) {
            lyrics = part.text;
          }
        }
      }

      if (!audioBase64) {
        return res.status(500).json({ error: 'No audio data received from Lyria model' });
      }

      return res.json({
        audioBase64,
        mimeType,
        lyrics,
        model: validModel
      });
    } catch (error: any) {
      console.error('Lyria music generation error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate music with Lyria',
        details: error.toString()
      });
    }
  });

  // --- VEO VIDEO GENERATION APIS ---
  // 1. Start generation
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { prompt, imageBase64, imageMimeType, aspectRatio = '16:9' } = req.body;
      const ai = getGenAI();

      const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';
      let cleanImageBytes: string | undefined;
      if (imageBase64) {
        cleanImageBytes = imageBase64.replace(/^data:[^;]+;base64,/, '');
      }

      const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'A cinematic floating night market scene with gentle wind blowing silk lanterns and celestial cloud atmosphere',
        image: cleanImageBytes ? {
          imageBytes: cleanImageBytes,
          mimeType: imageMimeType || 'image/jpeg'
        } : undefined,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: validAspectRatio
        }
      });

      return res.json({
        operationName: operation.name
      });
    } catch (error: any) {
      console.error('Veo video generation error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to start video generation',
        details: error.toString()
      });
    }
  });

  // 2. Poll video operation status
  app.post('/api/video-status', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      return res.json({
        done: Boolean(updated.done),
        error: updated.error ? (typeof updated.error === 'string' ? updated.error : updated.error.message || JSON.stringify(updated.error)) : null
      });
    } catch (error: any) {
      console.error('Veo video status error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to check video status',
        details: error.toString()
      });
    }
  });

  // 3. Download generated video
  app.post('/api/video-download', async (req, res) => {
    try {
      const { operationName } = req.body;
      if (!operationName) {
        return res.status(400).json({ error: 'operationName is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
      }

      const ai = getGenAI();
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) {
        return res.status(404).json({ error: 'Video URI not found in completed operation' });
      }

      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey },
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({ error: `Failed to fetch video stream: ${videoRes.statusText}` });
      }

      const arrayBuffer = await videoRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    } catch (error: any) {
      console.error('Veo video download error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to download video',
        details: error.toString()
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
