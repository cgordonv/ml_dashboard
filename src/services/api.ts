// src/services/api.ts
// API service layer for real data integration
import { NewsItem, SafetyAlert } from '../types/dashboard';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY as string | undefined;
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY as string | undefined;
// const ACCUWEATHER_API_KEY = import.meta.env.VITE_ACCUWEATHER_API_KEY as string | undefined; // reserved (not used yet)

// -----------------------------
// Weather (OpenWeather Current)
// -----------------------------
export async function fetchWeatherData(lat: number, lng: number) {
  if (!WEATHER_API_KEY) {
    console.warn('Weather API key not configured, using mock data');
    return getMockWeatherData();
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) throw new Error(`Weather API request failed (${response.status})`);

    const data = await response.json();

    return {
      temperature: Math.round(data.main?.temp),
      condition: data.weather?.[0]?.description ?? '—',
      humidity: data.main?.humidity ?? 0,
      windSpeed: Math.round(data.wind?.speed ?? 0),
      icon: getWeatherIcon(data.weather?.[0]?.main ?? ''),
      updatedAt: data.dt ? data.dt * 1000 : Date.now(), // ms
      locationName: data.name ?? 'Current Location',
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return getMockWeatherData();
  }
}

// -----------------------------
// News (NewsAPI.org)
// -----------------------------
export async function fetchNewsData(location: string): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.warn('News API key not configured, using mock data');
    return getMockNewsData();
  }

  try {
    const query = encodeURIComponent(location);
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) throw new Error(`News API request failed (${response.status})`);

    const data = await response.json();

    if (!Array.isArray(data?.articles)) return getMockNewsData();

    return data.articles.map((article: any, index: number) => ({
      id: `news-${index}`,
      title: article.title,
      summary: article.description || article.title || '—',
      source: article.source?.name ?? 'Unknown',
      publishedAt: article.publishedAt, // ISO string
      category: 'Local',
    }));
  } catch (error) {
    console.error('News API error:', error);
    return getMockNewsData();
  }
}

// ----------------------------------------------------
// Safety alerts (National Weather Service - api.weather.gov)
// ----------------------------------------------------
export async function fetchSafetyAlerts(lat: number, lng: number): Promise<SafetyAlert[]> {
  try {
    const response = await fetch(
      `https://api.weather.gov/alerts/active?point=${lat},${lng}`,
      {
        headers: {
          // Required by NWS: identify your app + a contact
          'User-Agent': 'news-weather-dashboard (youremail@example.com)',
          'Accept': 'application/ld+json',
        },
      }
    );

    if (!response.ok) {
      console.error(`Safety alerts API request failed with status ${response.status}`);
      throw new Error(`Safety alerts API request failed (${response.status})`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.features)) {
      console.warn('Unexpected NWS API format:', data);
      return [];
    }

    return data.features.map((alert: any, index: number) => ({
      id: `alert-${index}`,
      type: alert.properties?.event?.toLowerCase().includes('warning')
        ? 'warning'
        : 'watch',
      title: alert.properties?.event ?? 'Unknown Event',
      description: alert.properties?.headline ?? alert.properties?.description ?? 'No description available',
      severity: getSeverityLevel(alert.properties?.severity),
      issuedAt: alert.properties?.sent,     // ISO
      expiresAt: alert.properties?.expires, // ISO | undefined
    }));
  } catch (error) {
    console.error('Safety alerts API error:', error);
    return [];
  }
}

// -----------------------------
// Geocoding (OpenWeather Direct)
// -----------------------------
export async function geocodeLocation(query: string) {
  try {
    if (!WEATHER_API_KEY) throw new Error('Missing WEATHER_API_KEY');

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) throw new Error(`Geocoding request failed (${response.status})`);

    const data = await response.json();

    if (!Array.isArray(data)) return [];

    return data.map((loc: any) => ({
      name: `${loc.name}, ${loc.state || loc.country}`,
      lat: loc.lat,
      lng: loc.lon,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

// =====================
// Helpers & Mock Data
// =====================
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

function getSeverityLevel(severity: string | undefined): 'low' | 'medium' | 'high' | 'critical' {
  const map: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    Minor: 'low',
    Moderate: 'medium',
    Severe: 'high',
    Extreme: 'critical',
  };
  if (!severity) return 'medium';
  return map[severity] ?? 'medium';
}

function getMockWeatherData() {
  return {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    icon: '⛅',
    updatedAt: Date.now(),
    locationName: 'Mock Location',
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
