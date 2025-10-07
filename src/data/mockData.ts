import { Location } from '../types/dashboard';

export const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Myrtle Beach, SC',
    nickname: 'Myrtle Beach',
    coordinates: { lat: 33.6891, lng: -78.8867 },
    weather: {
      temperature: 76,
      condition: 'Sunny',
      humidity: 68,
      windSpeed: 12,
      icon: '☀️'
    },
    news: [
      {
        id: 'n1',
        title: 'Beach Renourishment Project Completes Phase 1',
        summary: 'Major sand restoration project adds 2 miles of new beach area...',
        source: 'Myrtle Beach Sun News',
        publishedAt: '2024-01-15T10:30:00Z',
        category: 'Local'
      },
      {
        id: 'n2',
        title: 'New Oceanfront Resort Opens',
        summary: 'Luxury resort brings 300 new jobs to the Grand Strand area...',
        source: 'Tourism Daily',
        publishedAt: '2024-01-15T08:15:00Z',
        category: 'Business'
      },
      {
        id: 'n3',
        title: 'Summer Concert Series Announced',
        summary: 'Popular artists lined up for beachfront performances this season...',
        source: 'Entertainment Weekly',
        publishedAt: '2024-01-14T16:45:00Z',
        category: 'Entertainment'
      }
    ],
    safetyAlerts: [
      {
        id: 'sa1',
        type: 'warning',
        title: 'Rip Current Advisory',
        description: 'Dangerous rip currents possible along all beaches',
        severity: 'medium',
        issuedAt: '2024-01-15T06:00:00Z',
        expiresAt: '2024-01-16T18:00:00Z'
      }
    ],
    lastUpdated: '2024-01-15T12:00:00Z'
  },
  {
    id: '2',
    name: 'Pawleys Island, SC',
    nickname: 'Pawleys Island',
    coordinates: { lat: 33.4343, lng: -79.1253 },
    weather: {
      temperature: 74,
      condition: 'Partly Cloudy',
      humidity: 72,
      windSpeed: 8,
      icon: '⛅'
    },
    news: [
      {
        id: 'n4',
        title: 'Historic Hammock Shop Celebrates 75 Years',
        summary: 'Local landmark continues tradition of handwoven rope hammocks...',
        source: 'Georgetown Times',
        publishedAt: '2024-01-15T11:00:00Z',
        category: 'Local'
      },
      {
        id: 'n5',
        title: 'Sea Turtle Nesting Season Begins',
        summary: 'Volunteers gear up for another successful conservation season...',
        source: 'Coastal Observer',
        publishedAt: '2024-01-15T09:30:00Z',
        category: 'Environment'
      }
    ],
    safetyAlerts: [],
    lastUpdated: '2024-01-15T11:45:00Z'
  },
  {
    id: '3',
    name: 'Boston, MA',
    nickname: 'Boston',
    coordinates: { lat: 42.3601, lng: -71.0589 },
    weather: {
      temperature: 52,
      condition: 'Cloudy',
      humidity: 78,
      windSpeed: 14,
      icon: '☁️'
    },
    news: [
      {
        id: 'n6',
        title: 'Big Dig Infrastructure Upgrades Continue',
        summary: 'Major improvements to tunnel systems enhance traffic flow...',
        source: 'Boston Globe',
        publishedAt: '2024-01-15T07:20:00Z',
        category: 'Local'
      },
      {
        id: 'n7',
        title: 'Red Sox Spring Training Schedule Released',
        summary: 'Fenway faithful gear up for another exciting baseball season...',
        source: 'ESPN Boston',
        publishedAt: '2024-01-15T12:15:00Z',
        category: 'Sports'
      },
      {
        id: 'n8',
        title: 'Boston Tea Party Ships Exhibit Expanded',
        summary: 'Interactive museum adds new experiences for visitors...',
        source: 'Boston Magazine',
        publishedAt: '2024-01-14T15:30:00Z',
        category: 'Culture'
      }
    ],
    safetyAlerts: [
      {
        id: 'sa2',
        type: 'warning',
        title: 'Wind Advisory',
        description: 'Gusty winds up to 40 mph expected through evening',
        severity: 'medium',
        issuedAt: '2024-01-15T10:00:00Z',
        expiresAt: '2024-01-15T22:00:00Z'
      }
    ],
    lastUpdated: '2024-01-15T12:15:00Z'
  },
  {
    id: '4',
    name: 'Greenville, SC',
    nickname: 'Greenville',
    coordinates: { lat: 34.8526, lng: -82.3940 },
    weather: {
      temperature: 68,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 6,
      icon: '⛅'
    },
    news: [
      {
        id: 'n9',
        title: 'Falls Park Visitor Center Renovation Complete',
        summary: 'Enhanced facilities welcome increased tourism to downtown area...',
        source: 'Greenville News',
        publishedAt: '2024-01-15T08:45:00Z',
        category: 'Local'
      },
      {
        id: 'n10',
        title: 'BMW Manufacturing Announces Expansion',
        summary: 'Plant investment brings 1,000 new jobs to Upstate region...',
        source: 'Business Journal',
        publishedAt: '2024-01-14T14:30:00Z',
        category: 'Business'
      }
    ],
    safetyAlerts: [],
    lastUpdated: '2024-01-15T11:30:00Z'
  },
  {
    id: '5',
    name: 'Santa Monica, CA',
    nickname: 'Santa Monica',
    coordinates: { lat: 34.0195, lng: -118.4912 },
    weather: {
      temperature: 72,
      condition: 'Sunny',
      humidity: 65,
      windSpeed: 10,
      icon: '☀️'
    },
    news: [
      {
        id: 'n11',
        title: 'Santa Monica Pier Gets Solar Panel Upgrade',
        summary: 'Landmark attraction goes green with sustainable energy initiative...',
        source: 'Santa Monica Daily Press',
        publishedAt: '2024-01-15T09:15:00Z',
        category: 'Environment'
      },
      {
        id: 'n12',
        title: 'Third Street Promenade Revitalization',
        summary: 'New retailers and restaurants breathe life into shopping district...',
        source: 'LA Times',
        publishedAt: '2024-01-15T07:45:00Z',
        category: 'Local'
      },
      {
        id: 'n13',
        title: 'Beach Volleyball Championships Return',
        summary: 'Professional tournament draws world-class athletes to the sand...',
        source: 'Sports Illustrated',
        publishedAt: '2024-01-14T18:20:00Z',
        category: 'Sports'
      }
    ],
    safetyAlerts: [
      {
        id: 'sa3',
        type: 'watch',
        title: 'Air Quality Alert',
        description: 'Elevated ozone levels due to offshore winds',
        severity: 'low',
        issuedAt: '2024-01-15T10:30:00Z',
        expiresAt: '2024-01-16T06:00:00Z'
      }
    ],
    lastUpdated: '2024-01-15T12:30:00Z'
  },
  {
    id: '6',
    name: 'Ocala, FL',
    nickname: 'Ocala',
    coordinates: { lat: 29.1872, lng: -82.1401 },
    weather: {
      temperature: 82,
      condition: 'Partly Cloudy',
      humidity: 73,
      windSpeed: 9,
      icon: '⛅'
    },
    news: [
      {
        id: 'n14',
        title: 'World Equestrian Center Hosts Major Competition',
        summary: 'International horse show brings thousands of visitors to Marion County...',
        source: 'Ocala Star-Banner',
        publishedAt: '2024-01-15T08:30:00Z',
        category: 'Sports'
      },
      {
        id: 'n15',
        title: 'Ocala National Forest Fire Prevention Campaign',
        summary: 'Rangers launch education initiative as dry season approaches...',
        source: 'Forest Service News',
        publishedAt: '2024-01-15T10:15:00Z',
        category: 'Environment'
      },
      {
        id: 'n16',
        title: 'Downtown Ocala Farmers Market Expands',
        summary: 'Local vendors showcase fresh produce and artisan goods...',
        source: 'Marion County News',
        publishedAt: '2024-01-14T16:20:00Z',
        category: 'Local'
      }
    ],
    safetyAlerts: [
      {
        id: 'sa4',
        type: 'warning',
        title: 'Heat Advisory',
        description: 'Dangerous heat index values up to 105°F expected',
        severity: 'high',
        issuedAt: '2024-01-15T08:00:00Z',
        expiresAt: '2024-01-15T20:00:00Z'
      }
    ],
    lastUpdated: '2024-01-15T11:15:00Z'
  },
  {
    id: '7',
    name: 'Charlotte, NC',
    nickname: 'Charlotte',
    coordinates: { lat: 35.2271, lng: -80.8431 },
    weather: {
      temperature: 71,
      condition: 'Thunderstorms',
      humidity: 84,
      windSpeed: 15,
      icon: '⛈️'
    },
    news: [
      {
        id: 'n17',
        title: 'Panthers Stadium Upgrades Unveiled',
        summary: 'Bank of America Stadium receives major technology improvements...',
        source: 'Charlotte Observer',
        publishedAt: '2024-01-15T09:45:00Z',
        category: 'Sports'
      },
      {
        id: 'n18',
        title: 'Light Rail Extension Project Breaks Ground',
        summary: 'LYNX Blue Line expansion connects University area to downtown...',
        source: 'WCNC Charlotte',
        publishedAt: '2024-01-15T11:20:00Z',
        category: 'Local'
      },
      {
        id: 'n19',
        title: 'Charlotte Tech Hub Attracts Major Investment',
        summary: 'Fortune 500 companies establish regional headquarters in Queen City...',
        source: 'Charlotte Business Journal',
        publishedAt: '2024-01-14T13:15:00Z',
        category: 'Business'
      }
    ],
    safetyAlerts: [
      {
        id: 'sa5',
        type: 'warning',
        title: 'Severe Thunderstorm Warning',
        description: 'Damaging winds and large hail possible through afternoon',
        severity: 'high',
        issuedAt: '2024-01-15T11:00:00Z',
        expiresAt: '2024-01-15T17:00:00Z'
      },
      {
        id: 'sa6',
        type: 'watch',
        title: 'Flood Watch',
        description: 'Heavy rainfall may cause localized flooding in low-lying areas',
        severity: 'medium',
        issuedAt: '2024-01-15T10:45:00Z',
        expiresAt: '2024-01-16T08:00:00Z'
      }
    ],
    lastUpdated: '2024-01-15T12:45:00Z'
  }
];