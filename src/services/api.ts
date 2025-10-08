// src/services/api.ts
import { Location, NewsItem, SafetyAlert } from '../types/dashboard';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const ACCUWEATHER_API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY;

// 👇 New: determines if you're on local dev or deployed
const USE_PROXY = !import.meta.env.DEV; // true on Vercel, false locally

// ----------------------------
// WEATHER API
// ----------------------------
export async function fetchWeatherData(lat: number, lng: number) {
  try {
    const url = USE_PROXY
      ? `/api/weather?lat=${lat}&lng=${lng}`
      : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=imperial`;

    const response = await fetch(url);

    if (!response.ok) throw new Error('Weather API request failed');
    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      icon: getWeatherIcon(data.weather[0].main),
      updatedAt: data.dt ? data.dt * 1000 : Date.now(),
      locationName: data.name,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return getMockWeatherData();
  }
}

// Build a static radar snapshot image (centered on lat,lng)
// Docs pattern: https://tilecache.rainviewer.com/v2/radar/last/{size}/{lat},{lng}/{zoom}/{opacity}_{snow}.png
export function buildRadarImageUrl(lat: number, lng: number, size = 768, zoom = 7) {
  const clampedZoom = Math.min(12, Math.max(3, zoom));
  const cacheBust = Date.now(); // avoid stale caching
  return `https://tilecache.rainviewer.com/v2/radar/last/${size}/${lat},${lng}/${clampedZoom}/1_1.png?cb=${cacheBust}`;
}

// Nice “live radar” page centered on your lat/lng
export function buildLiveRadarLink(lat: number, lng: number, zoom = 7) {
  const clampedZoom = Math.min(12, Math.max(3, zoom));
  return `https://www.rainviewer.com/map.html?loc=${lat},${lng},${clampedZoom},oFa`;
}


// ----------------------------
// NEWS API
// ----------------------------
export async function fetchNewsData(location: string): Promise<NewsItem[]> {
  try {
    const query = encodeURIComponent(location);
    const url = USE_PROXY
      ? `/api/news?q=${query}`
      : `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('News API request failed');
    const data = await response.json();

    return data.articles?.map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title,
      summary: article.description || article.title,
      source: article.source?.name ?? 'Unknown',
      publishedAt: article.publishedAt,
      category: 'Local',
      url: article.url,
    })) ?? [];
  } catch (error) {
    console.error('News API error:', error);
    return getMockNewsData();
  }
}

// ----------------------------
// SAFETY ALERTS (NWS)
// ----------------------------
export async function fetchSafetyAlerts(lat: number, lng: number): Promise<SafetyAlert[]> {
  try {
    const url = USE_PROXY
      ? `/api/alerts?lat=${lat}&lng=${lng}`
      : `https://api.weather.gov/alerts/active?point=${lat},${lng}`;

    const options = USE_PROXY
      ? {}
      : {
          headers: {
            'User-Agent': 'news-weather-dashboard (youremail@example.com)',
            'Accept': 'application/ld+json',
          },
        };

    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Safety alerts API request failed');
    const data = await response.json();

    if (!data || !Array.isArray(data.features)) return [];

    return data.features.map((alert: any, index: number) => ({
      id: `alert-${index}`,
      type: alert.properties?.event?.toLowerCase().includes('warning')
        ? 'warning'
        : 'watch',
      title: alert.properties?.event ?? 'Unknown Event',
      description: alert.properties?.headline ?? alert.properties?.description ?? 'No description available',
      severity: getSeverityLevel(alert.properties?.severity),
      issuedAt: alert.properties?.sent,
      expiresAt: alert.properties?.expires,
    }));
  } catch (error) {
    console.error('Safety alerts API error:', error);
    return [];
  }
}

// ----------------------------
// GEOCODING
// ----------------------------
export async function geocodeLocation(query: string) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) throw new Error('Geocoding request failed');
    const data = await response.json();

    return data.map((location: any) => ({
      name: `${location.name}, ${location.state || location.country}`,
      lat: location.lat,
      lng: location.lon,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// ----------------------------
// HELPERS
// ----------------------------
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

function getSeverityLevel(severity: string): 'low' | 'medium' | 'high' {
  const severityMap: Record<string, 'low' | 'medium' | 'high'> = {
    Minor: 'low',
    Moderate: 'medium',
    Severe: 'high',
    Extreme: 'high',
  };
  return severityMap[severity] || 'medium';
}

function getMockWeatherData() {
  return {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    icon: '⛅',
    updatedAt: Date.now(),
    locationName: 'Mock City',
  };
}

function getMockNewsData(): NewsItem[] {
  return [
    {
      id: 'mock-1',
      title: 'Local News Update',
      summary: 'Stay informed with the latest local developments...',
      source: 'Local News',
      publishedAt: new Date().toISOString(),
      category: 'Local',
    },
  ];
}
