// src/services/api.ts
import type { Location, NewsItem, SafetyAlert } from '../types/dashboard';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const NEWS_API_KEY_BROWSER = import.meta.env.VITE_NEWS_API_KEY; // optional if hitting NewsAPI direct (we use proxy)
const ACCUWEATHER_API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY; // not used now, kept for future

// ---------- WEATHER (OpenWeather) ----------
export async function fetchWeatherData(lat: number, lng: number) {
  // Try proxy first (works on Vercel & when running `vercel dev`)
  try {
    const proxied = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
    if (proxied.ok) {
      const data = await proxied.json();
      return {
        temperature: Math.round(data.main?.temp ?? 0),
        condition: data.weather?.[0]?.description ?? '—',
        humidity: data.main?.humidity ?? 0,
        windSpeed: Math.round(data.wind?.speed ?? 0),
        icon: getWeatherIcon(data.weather?.[0]?.main ?? ''),
        updatedAt: data.dt ? data.dt * 1000 : Date.now(),
        locationName: data.name || '',
        countryCode: data.sys?.country || '',
      };
    }
    console.warn('Proxy /api/weather returned', proxied.status);
  } catch (e) {
    console.warn('Proxy /api/weather not available locally, falling back direct', e);
  }

  // Fallback: direct (may CORS-fail in some browsers during local dev)
  if (!WEATHER_API_KEY) {
    console.warn('Weather API key not configured, using mock data');
    return getMockWeatherData();
  }
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    if (!resp.ok) throw new Error('Weather API request failed');
    const data = await resp.json();
    return {
      temperature: Math.round(data.main?.temp ?? 0),
      condition: data.weather?.[0]?.description ?? '—',
      humidity: data.main?.humidity ?? 0,
      windSpeed: Math.round(data.wind?.speed ?? 0),
      icon: getWeatherIcon(data.weather?.[0]?.main ?? ''),
      updatedAt: data.dt ? data.dt * 1000 : Date.now(),
      locationName: data.name || '',
      countryCode: data.sys?.country || '',
    };
  } catch (e) {
    console.error('Weather API error:', e);
    return getMockWeatherData();
  }
}


// ---------- NEWS (proxy → English-only + local bias) ----------
export async function fetchNewsDataForLocation(name: string): Promise<NewsItem[]> {
  // bias towards local hits and exclude generic international
  const q = encodeURIComponent(`${name} (local OR city OR county) -international`);
  const url = `/api/news?q=${q}`; // handled by src/api/news.ts

  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('News API request failed');

    const data = await r.json();
    return (data.articles || []).map((article: any, i: number) => ({
      id: `news-${i}`,
      title: article.title,
      summary: article.description || article.title,
      source: article.source?.name || 'News',
      publishedAt: article.publishedAt,
      category: 'Local',
      url: article.url,
    }));
  } catch (e) {
    console.error('News API error:', e);
    return getMockNewsData();
  }
}

// ---------- NWS SAFETY ALERTS ----------
export async function fetchSafetyAlerts(lat: number, lng: number): Promise<SafetyAlert[]> {
  try {
    const resp = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat},${lng}`,
      {
        headers: {
          'User-Agent': 'news-weather-dashboard (youremail@example.com)',
          'Accept': 'application/ld+json',
        },
      }
    );
    if (!resp.ok) throw new Error(`Safety alerts API request failed (${resp.status})`);

    const data = await resp.json();
    if (!data || !Array.isArray(data.features)) return [];

    return data.features.map((f: any, idx: number) => {
      const p = f?.properties ?? {};
      const event = p.event ?? 'Alert';
      const sev = (p.severity as string) || 'Moderate';
      const type = /warning/i.test(event) ? 'warning' : /watch/i.test(event) ? 'watch' : 'emergency';
      return {
        id: `alert-${idx}`,
        type,
        title: event,
        description: p.headline ?? p.description ?? 'No description available',
        severity: getSeverityLevel(sev),
        issuedAt: p.sent,
        expiresAt: p.expires,
      } as SafetyAlert;
    });
  } catch (e) {
    console.error('Safety alerts API error:', e);
    return [];
  }
}

// ---------- GEOCODING (OpenWeather) ----------
export async function geocodeLocation(query: string) {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`
    );
    if (!resp.ok) throw new Error('Geocoding request failed');
    const data = await resp.json();
    return data.map((loc: any) => ({
      name: `${loc.name}, ${loc.state || loc.country}`,
      lat: loc.lat,
      lng: loc.lon,
    }));
  } catch (e) {
    console.error('Geocoding error:', e);
    return [];
  }
}

// ---------- HELPERS ----------
function getWeatherIcon(condition: string): string {
  const iconMap: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
  };
  return iconMap[condition] || '🌤️';
}

function getSeverityLevel(severity: string): 'low' | 'medium' | 'high' | 'critical' {
  const map: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    Minor: 'low',
    Moderate: 'medium',
    Severe: 'high',
    Extreme: 'critical',
  };
  return map[severity] || 'medium';
}

// ---------- MOCKS ----------
function getMockWeatherData() {
  return {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    icon: '⛅',
    updatedAt: Date.now(),
    locationName: 'Current Location',
  };
}

function getMockNewsData(): NewsItem[] {
  return [
    {
      id: 'mock-1',
      title: 'Local News Update',
      summary: 'Stay informed with the latest local developments…',
      source: 'Local News',
      publishedAt: new Date().toISOString(),
      category: 'Local',
    },
  ];
}
