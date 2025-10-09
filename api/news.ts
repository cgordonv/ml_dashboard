// src/api/news.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const q = (req.query.q as string | undefined)?.trim();
    if (!q) return res.status(400).json({ error: 'Missing q' });

    // Accept either NEWS_API_KEY or VITE_NEWS_API_KEY set in Vercel Env
    const API_KEY = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY;
    if (!API_KEY) return res.status(401).json({ error: 'Missing NEWS_API_KEY' });

    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', q);
    url.searchParams.set('language', 'en');       // English only
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '6');

    const r = await fetch(url.toString(), {
      headers: { 'X-Api-Key': API_KEY },
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: `News API error: ${r.status}` });
    }

    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
}
