// api/news.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = (req.query.q as string) ?? 'local';
    const r = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&pageSize=5`,
      { headers: { 'X-Api-Key': process.env.NEWS_API_KEY! } }
    );

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e: any) {
    console.error('News proxy error:', e);
    res.status(500).json({ error: String(e) });
  }
}
