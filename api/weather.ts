// /api/weather.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const lat = req.query.lat as string | undefined;
    const lng = req.query.lng as string | undefined;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Missing lat/lng' });
    }

    const API_KEY = process.env.WEATHER_API_KEY || process.env.VITE_WEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(401).json({ error: 'Missing WEATHER_API_KEY' });
    }

    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lng);
    url.searchParams.set('appid', API_KEY);
    url.searchParams.set('units', 'imperial');

    const r = await fetch(url.toString());
    if (!r.ok) {
      return res.status(r.status).json({ error: `OpenWeather error: ${r.status}` });
    }
    const data = await r.json();

    // CORS header (helps in some local setups)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');

    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}
