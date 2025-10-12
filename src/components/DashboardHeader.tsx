// src/components/DashboardHeader.tsx
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
  lastRefreshed?: number; // optional
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
    <header className="flex flex-col gap-3 p-4 border-b bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Weather & News Dashboard</h1>
   
<p className="text-sm text-muted-foreground">
  Locations: {locationCount} • Last refreshed:{' '}
  {typeof lastRefreshed === 'number'
    ? new Date(lastRefreshed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '—'}
</p>

        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAddLocation}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button variant="ghost" onClick={onThemeToggle} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm">
          Sort:{' '}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="border rounded p-1 ml-1"
          >
            <option value="name">Name</option>
            <option value="nickname">Nickname</option>
            <option value="alerts">Alert Count</option>
            <option value="lastUpdated">Last Updated</option>
          </select>
        </label>
      </div>
    </header>
  );
}
