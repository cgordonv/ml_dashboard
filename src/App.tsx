import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { LocationCard } from './components/LocationCard';
import { LocationDetail } from './components/LocationDetail';
import AddLocationDialog from './components/AddLocationDialog';
import { DashboardHeader } from './components/DashboardHeader';
import { AlertTicker } from './components/AlertTicker';
import type { Location, SortOption } from './types/dashboard';
import { fetchWeatherData, fetchSafetyAlerts, fetchNewsDataForLocation } from './services/api';

const STORAGE_KEY = 'nw_dashboard_v1';

export default function App() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Load locations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocations(JSON.parse(saved));
      }
    } catch (err) {
      console.warn('Failed to parse saved locations', err);
    }
  }, []);

  // Save locations
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }, [locations]);

  // Compute latest “refreshed” time across all locations
  const lastRefreshed = useMemo(() => {
    if (!locations.length) return undefined;

    const toMs = (v: string | number | undefined): number => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = Date.parse(v);
        return Number.isFinite(n) ? n : 0;
      }
      return 0;
    };

    const ts = locations
      .map((l) => Math.max((l.weather as any)?.updatedAt ?? 0, toMs(l.lastUpdated)))
      .reduce((a, b) => Math.max(a, b), 0);

    return ts > 0 ? ts : undefined;
  }, [locations]);

  const handleAddLocation = async (name: string, lat: number, lng: number) => {
    const id = uuid();
    const newLocation: Location = { id, name, lat, lng };

    try {
      const [weather, alerts, news] = await Promise.all([
        fetchWeatherData(lat, lng),
        fetchSafetyAlerts(lat, lng),
        fetchNewsDataForLocation(name),
      ]);

      newLocation.weather = weather;
      newLocation.alerts = alerts;
      newLocation.news = news;
      newLocation.lastUpdated = new Date().toISOString();
      setLocations((prev) => [...prev, newLocation]);
    } catch (err) {
      console.error('Failed to add location', err);
    }
  };

  const handleDelete = (id: string) => setLocations((prev) => prev.filter((l) => l.id !== id));
  const handleSelect = (loc: Location) => setSelectedLocation(loc);
  const handleBackToDashboard = () => setSelectedLocation(null);
  const handleEditLocation = (loc: Location) => setSelectedLocation(loc);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <DashboardHeader
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddLocation={() => setIsAddDialogOpen(true)}
        locationCount={locations.length}
        lastRefreshed={lastRefreshed}
      />
      <AlertTicker locations={locations} />

      {!selectedLocation ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {locations.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <LocationDetail
          location={selectedLocation}
          onBack={handleBackToDashboard}
          onEdit={handleEditLocation}
        />
      )}

      <AddLocationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddLocation}
      />
    </div>
  );
}
