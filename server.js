import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from './api/tts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

// API proxy for ElevenLabs TTS
app.post('/api/tts', (req, res) => handler(req, res));

// Serve the built Vite app
app.use(express.static(path.join(__dirname, 'app/dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/dist/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Gian Lucca's Ranch server listening on port ${port}`);
});
