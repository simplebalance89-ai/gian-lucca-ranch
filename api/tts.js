/**
 * Vercel serverless function that proxies ElevenLabs text-to-speech.
 * This keeps ELEVENLABS_API_KEY server-side so it is never exposed in the browser bundle.
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId, voice_settings } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "text" in request body' });
  }

  if (!voiceId || typeof voiceId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "voiceId" in request body' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'ElevenLabs API key is not configured. Add ELEVENLABS_API_KEY to your Vercel environment variables.',
    });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          ...(voice_settings ? { voice_settings } : {}),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown ElevenLabs error');
      return res.status(response.status).json({ error: errorText });
    }

    // Stream the audio back to the browser
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'audio/mpeg');
    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to generate audio';
    return res.status(500).json({ error: message });
  }
}
