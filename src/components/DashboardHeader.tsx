import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { SortOption } from '../types/dashboard';
import { Plus, Sun, Moon, ArrowUpDown } from 'lucide-react';

interface DashboardHeaderProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onAddLocation: () => void;
  locationCount: number;
  lastRefreshed?: number | string; // ✅ NEW
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
  const fmt = (d?: number | string) => {
    if (d == null) return '—';
    const date = typeof d === 'number' ? new Date(d) : new Date(d);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Location Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor news, weather, and safety alerts across {locationCount} location
            {locationCount !== 1 && 's'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="flex items-center gap-2" aria-label="Toggle theme">
            <Sun className="h-4 w-4" />
            <Switch
              checked={isDarkMode}
              onCheckedChange={onThemeToggle}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-4 w-4" />
          </div>

          {/* Add Location Button */}
          <Button onClick={onAddLocation}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        {/* Sorting */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <Label htmlFor="sort-select">Sort by:</Label>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => onSortChange(value)}
          >
            <SelectTrigger id="sort-select" className="w-40">
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Location Name</SelectItem>
              <SelectItem value="nickname">Nickname</SelectItem>
              <SelectItem value="alerts">Alert Count</SelectItem>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Last Refreshed */}
        <div className="text-sm text-muted-foreground">
          Last refreshed: {fmt(lastRefreshed)}
        </div>
      </div>
    </div>
  );
}
