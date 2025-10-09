import { useEffect, useMemo, useState } from 'react';
import { LocationCard } from './components/LocationCard';
import { LocationDetail } from './components/LocationDetail';
import { AddLocationDialog } from './components/AddLocationDialog';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertTicker } from './components/AlertTicker';
import type { Location, SortOption, ViewMode } from './types/dashboard';
import { fetchWeatherData, fetchSafetyAlerts, fetchNewsDataForLocation } from './services/api';
import { v4 as uuid } from 'uuid';

// helper: normalize (string|number) to ms
const toMs = (v: string | number | undefined): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

export default function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  // Latest "refreshed" timestamp across all locations (weather.updatedAt or lastUpdated)
  const lastRefreshed = useMemo(() => {
    if (!locations.length) return undefined;
    const ts = locations
      .map((l) => Math.max((l.weather as any)?.updatedAt ?? 0, toMs(l.lastUpdated)))
      .reduce((a, b) => Math.max(a, b), 0);
    return ts > 0 ? ts : undefined;
  }, [locations]);

  // Sort locations
  const sortedLocations = useMemo(() => {
    const copy = [...locations];
    copy.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'nickname':
          return a.nickname.localeCompare(b.nickname);
        case 'alerts':
          return b.safetyAlerts.length - a.safetyAlerts.length;
        case 'lastUpdated': {
          const ta = Math.max((a.weather as any)?.updatedAt ?? 0, toMs(a.lastUpdated));
          const tb = Math.max((b.weather as any)?.updatedAt ?? 0, toMs(b.lastUpdated));
          return tb - ta;
        }
        default:
          return 0;
      }
    });
    return copy;
  }, [locations, sortBy]);

  // On first load, try current geolocation -> fetch weather/alerts/news
  useEffect(() => {
    if (locations.length > 0) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const [wx, alerts] = await Promise.all([
            fetchWeatherData(lat, lng),
            fetchSafetyAlerts(lat, lng),
          ]);

          // local news based on OpenWeather city name (fallback to coords string)
          const city = wx?.locationName || `${lat.toFixed(2)}, ${lng.toFixed(2)}`;
          const news = await fetchNewsDataForLocation(city);

          const updatedAtMs = wx?.updatedAt ?? Date.now();

          const newLoc: Location = {
            id: uuid(),
            name: wx?.locationName || 'Current Location',
            nickname: 'Current',
            coordinates: { lat, lng },
            weather: {
              temperature: wx?.temperature ?? 0,
              condition: wx?.condition ?? '—',
              icon: wx?.icon ?? '🌤️',
              humidity: wx?.humidity ?? 0,
              windSpeed: wx?.windSpeed ?? 0,
              // @ts-ignore - your WeatherData type can include this if desired
              updatedAt: updatedAtMs,
            } as any,
            safetyAlerts: alerts ?? [],
            news: news ?? [],
            lastUpdated: updatedAtMs, // store ms; components format for display
          };

          setLocations([newLoc]);
          setSelectedLocation(newLoc); // optional: jump to detail
        } catch (e) {
          console.warn('Initial load error', e);
        }
      },
      (err) => {
        console.warn('Geolocation error', err);
        // leave empty; user can add locations manually
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.length]);

  // Handlers
  const handleExpandLocation = (loc: Location) => {
    setSelectedLocation(loc);
    setViewMode('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedLocation(null);
    setViewMode('dashboard');
  };

  const handleEditLocation = (loc: Location) => {
    setEditingLocation(loc);
    setIsAddDialogOpen(true);
  };

  const handleSaveLocation = (loc: Location) => {
    setLocations((prev) => {
      const exists = prev.some((p) => p.id === loc.id);
      if (exists) {
        return prev.map((p) => (p.id === loc.id ? loc : p));
      }
      return [...prev, loc];
    });
    if (selectedLocation?.id === loc.id) setSelectedLocation(loc);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== locationId));
    if (selectedLocation?.id === locationId) handleBackToDashboard();
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLocation(null);
  };

  // Render
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {viewMode === 'dashboard' ? (
          <div className="space-y-6">
            <DashboardHeader
              isDarkMode={isDarkMode}
              onThemeToggle={() => setIsDarkMode(!isDarkMode)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onAddLocation={() => setIsAddDialogOpen(true)}
              locationCount={locations.length}
              lastRefreshed={lastRefreshed}
            />

            <AlertTicker
              locations={locations}
              onLocationClick={handleExpandLocation}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedLocations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  onExpand={handleExpandLocation}
                  onEdit={handleEditLocation}
                />
              ))}
            </div>

            {locations.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No locations added yet
                </p>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="text-primary hover:underline"
                >
                  Add your first location
                </button>
              </div>
            )}
          </div>
        ) : (
          selectedLocation && (
            <LocationDetail
              location={selectedLocation}
              onBack={handleBackToDashboard}
              onEdit={handleEditLocation}
            />
          )
        )}

        <AddLocationDialog
          isOpen={isAddDialogOpen}
          onClose={handleCloseAddDialog}
          onSave={handleSaveLocation}
          editingLocation={editingLocation}
        />
      </div>
    </div>
  );
}
