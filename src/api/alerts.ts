import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lat = req.query.lat as string | undefined;
    const lng = req.query.lng as string | undefined;
    if (!lat || !lng) return res.status(400).json({ error: 'lat/lng required' });

    const r = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lng}`, {
      headers: {
        'User-Agent': 'news-weather-dashboard (youremail@example.com)', // REQUIRED by NWS
        'Accept': 'application/ld+json',
      },
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    res.status(500).json({ error: String(e) });
  }
}
