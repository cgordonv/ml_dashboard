// api/weather.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { lat, lng } = req.query as { lat?: string; lng?: string };

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat/lng parameters' });
    }

    // Build request to OpenWeather
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.VITE_WEATHER_API_KEY}&units=imperial`;

    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Weather API request failed' });
    }

    const data = await r.json();
    res.status(200).json(data);
  } catch (e: any) {
    console.error('Weather proxy error:', e);
    res.status(500).json({ error: String(e) });
  }
}
