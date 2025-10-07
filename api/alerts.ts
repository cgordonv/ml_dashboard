// api/alerts.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { lat, lng } = req.query as { lat?: string; lng?: string };
    if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required' });

    const r = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lng}`, {
      headers: {
        'User-Agent': 'news-weather-dashboard (youremail@example.com)',
        'Accept': 'application/ld+json',
      },
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    console.error('Alerts proxy error:', e);
    res.status(500).json({ error: String(e) });
  }
}
