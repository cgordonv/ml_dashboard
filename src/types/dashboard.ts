// src/types/dashboard.ts

// Weather returned from your API layer (services/api.ts)
// updatedAt is a JS timestamp in milliseconds (e.g., OpenWeather dt * 1000)
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  updatedAt?: number; // ms since epoch; optional to stay backward-compatible
}

// News items (NewsAPI or other providers)
// publishedAt can be ISO string or ms, depending on source
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string | number;
  category: string;
}

// Safety alerts (NWS)
// issuedAt/expiresAt can be ISO string or ms
export interface SafetyAlert {
  id: string;
  type: 'warning' | 'watch' | 'emergency';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issuedAt: string | number;
  expiresAt?: string | number;
}

export interface Location {
  id: string;
  name: string;       // e.g., "Greenville, SC"
  nickname: string;   // e.g., "Home" / "Current"
  coordinates: {
    lat: number;
    lng: number;
  };
  weather: WeatherData;
  news: NewsItem[];
  safetyAlerts: SafetyAlert[];
  // We keep lastUpdated to drive sorting and display fallbacks.
  // Accept string (ISO) or number (ms) to make it easy to set from code.
  lastUpdated: string | number;
}

export type SortOption = 'name' | 'nickname' | 'alerts' | 'lastUpdated';
export type ViewMode = 'dashboard' | 'detail';
