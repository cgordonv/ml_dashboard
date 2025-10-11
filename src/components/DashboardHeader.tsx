import { Button } from './ui/button';
import { Sun, Moon, Plus } from 'lucide-react';
import type { SortOption } from '../types/dashboard';

interface DashboardHeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onAddLocation: () => void;
  locationCount: number;
  lastRefreshed?: number; // new optional prop
}

export function DashboardHeader({
  isDarkMode,
  onThemeToggle,
  sortBy,
  onSortChange,
  onAddLocation,
  locationCount,
  lastRefreshed,
}: DashboardHeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-background">
      <div>
        <h1 className="text-xl font-semibold">Weather & News Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Locations: {locationCount} • Last refreshed:{' '}
          {lastRefreshed
            ? new Date(lastRefreshed).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="border rounded p-1"
        >
          <option value="name">Sort: Name</option>
          <option value="updated">Sort: Updated</option>
        </select>
        <Button onClick={onAddLocation}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        <Button variant="ghost" onClick={onThemeToggle}>
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}

