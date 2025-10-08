// src/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { LocationCard } from './components/LocationCard';
import { LocationDetail } from './components/LocationDetail';
import { AddLocationDialog } from './components/AddLocationDialog';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertTicker } from './components/AlertTicker';
import { Location, SortOption, ViewMode } from './types/dashboard';
import { fetchNewsData, fetchSafetyAlerts, fetchWeatherData } from './services/api';
import { v4 as uuid } from 'uuid';

// Optional: persist to localStorage so locations/theme survive reloads
const STORAGE_KEY = 'nw_dashboard_v1';

export default function App() {
  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ---- Hydrate localStorage once (optional persistence) ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (Array.isArray(data?.locations)) setLocations(data.locations);
      if (data?.sortBy) setSortBy(data.sortBy as SortOption);
      if (typeof data?.isDarkMode === 'boolean') setIsDarkMode(data.isDarkMode);
    } catch (e) {
      console.warn('Failed to read saved dashboard state:', e);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      const payload = {
        locations,
        sortBy,
        isDarkMode,
        savedAt: Date.now(),
        schema: 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to persist dashboard state:', e);
    }
  }, [locations, sortBy, isDarkMode]);

  // ---- Theme toggle ----
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [isDarkMode]);

  // ---- Helpers ----
  const toMs = (v: string | number | undefined): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const n = Date.parse(v);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  // Latest refresh time across locations (uses weather.updatedAt or lastUpdated)
  const lastRefreshed = useMemo(() => {
    if (!locations.length) return undefined;
    const ts = locations
      .map((l) => Math.max((l.weather as any)?.updatedAt ?? 0, toMs(l.lastUpdated)))
      .reduce((a, b) => Math.max(a, b), 0);
    return ts > 0 ? ts : undefined;
  }, [locations]);

  // Sorted locations
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

  // ---- First-load: current location (with NYC fallback if denied) ----
  useEffect(() => {
    if (locations.length > 0) return;

    const buildAndAdd = (lat: number, lng: number, newsQuery: string, nickname = 'Current') => {
      (async () => {
        try {
          const [wx, alerts, news] = await Promise.all([
            fetchWeatherData(lat, lng),
            fetchSafetyAlerts(lat, lng),
            fetchNewsData(newsQuery),
          ]);

          const updatedAtMs = wx?.updatedAt ?? Date.now();

          const newLoc: Location = {
            id: uuid(),
            name: wx?.locationName || newsQuery || 'Current Location',
            nickname,
            coordinates: { lat, lng },
            weather: {
              temperature: wx?.temperature ?? 0,
              condition: wx?.condition ?? '—',
              icon: wx?.icon ?? '🌤️',
              humidity: wx?.humidity ?? 0,
              windSpeed: wx?.windSpeed ?? 0,
              // not in your WeatherData type originally; safe to keep extra field with "as any"
              // @ts-ignore
              updatedAt: updatedAtMs,
            } as any,
            safetyAlerts: alerts ?? [],
            news: news ?? [],
            // allow number or string in your types; we’ll store ms
            lastUpdated: updatedAtMs as any,
          };

          setLocations([newLoc]);
          setSelectedLocation(newLoc); // optional: open detail immediately
        } catch (e) {
          console.warn('Initial load error', e);
        }
      })();
    };

    // Ask for browser location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        buildAndAdd(lat, lng, 'local', 'Current');
      },
      (err) => {
        console.warn('Geolocation error', err);
        // Fallback to NYC
        buildAndAdd(40.7128, -74.0060, 'New York', 'NYC');
      },
      { timeout: 10000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations.length]);

  // ---- Handlers ----
  const handleExpandLocation = (location: Location) => {
    setSelectedLocation(location);
    setViewMode('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedLocation(null);
    setViewMode('dashboard');
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsAddDialogOpen(true);
  };

  const handleSaveLocation = (location: Location) => {
    if (editingLocation) {
      // update existing
      setLocations((prev) => prev.map((l) => (l.id === location.id ? location : l)));
      if (selectedLocation?.id === location.id) setSelectedLocation(location);
    } else {
      // add new
      setLocations((prev) => [...prev, location]);
    }
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

  // ---- Render ----
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

            {/* Alert Ticker */}
            <AlertTicker locations={locations} onLocationClick={handleExpandLocation} />

            {/* Location Grid */}
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
                <p className="text-muted-foreground mb-4">No locations added yet</p>
                <button onClick={() => setIsAddDialogOpen(true)} className="text-primary hover:underline">
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
          onDelete={handleDeleteLocation}
        />
      </div>
    </div>
  );
}
