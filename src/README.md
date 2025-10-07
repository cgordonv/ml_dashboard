# News, Weather & Safety Dashboard

A comprehensive dashboard for monitoring news, weather conditions, and safety alerts across multiple locations.

## Features

- 📍 Multi-location tracking with custom nicknames
- 🌤️ Real-time weather data integration
- 📰 Latest news updates by location
- ⚠️ Safety alerts and warnings
- 🗺️ AccuWeather radar integration
- 🌙 Dark/Light theme support
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd news-weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:
```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
VITE_NEWS_API_KEY=your_newsapi_key
VITE_ACCUWEATHER_API_KEY=your_accuweather_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build locally: `npm run build`
2. Deploy `dist` folder to Netlify

### Other Platforms
- **Railway**: Connect GitHub repo
- **GitHub Pages**: Use GitHub Actions
- **Firebase Hosting**: `firebase deploy`

## API Integration

To make this a fully functional app, you'll need:

1. **Weather API**: OpenWeatherMap or AccuWeather
2. **News API**: NewsAPI or similar service
3. **Geocoding**: For location coordinates
4. **Database**: For storing user locations (optional)

## Environment Variables

```env
VITE_WEATHER_API_KEY=your_api_key
VITE_NEWS_API_KEY=your_api_key
VITE_ACCUWEATHER_API_KEY=your_api_key
```

## License

MIT License