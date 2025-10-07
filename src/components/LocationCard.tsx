import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Location } from '../types/dashboard';
import { AlertTriangle, Edit3, Droplets, Wind, Clock } from 'lucide-react';

interface LocationCardProps {
  location: Location;
  onExpand: (location: Location) => void;
  onEdit: (location: Location) => void;
}

export function LocationCard({ location, onExpand, onEdit }: LocationCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Accept string | number | Date; render HH:MM local
  const formatTime = (d: string | number | Date) => {
    const date = typeof d === 'number' ? new Date(d) : new Date(d);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Prefer API timestamp; fall back to location.lastUpdated; then now
  const lastUpdated =
    (location.weather as any)?.updatedAt ?? location.lastUpdated ?? Date.now();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onExpand(location)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="truncate">{location.nickname}</h3>
            <p className="text-muted-foreground text-sm">{location.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(location);
              }}
              aria-label={`Edit ${location.nickname}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>

            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-2xl">{location.weather?.icon ?? '🌤️'}</span>
                <span className="text-xl">
                  {typeof location.weather?.temperature === 'number'
                    ? `${location.weather.temperature}°F`
                    : '—'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {location.weather?.condition ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            <span>
              {typeof location.weather?.humidity === 'number'
                ? `${location.weather.humidity}%`
                : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="h-3 w-3" />
            <span>
              {typeof location.weather?.windSpeed === 'number'
                ? `${location.weather.windSpeed} mph`
                : '—'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(lastUpdated)}</span>
          </div>
        </div>

        {/* Safety Alerts */}
        {location.safetyAlerts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Safety Alerts</span>
            </div>
            <div className="space-y-1">
              {location.safetyAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-center gap-2">
                  <Badge variant="secondary" className={`text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </Badge>
                  <span className="text-xs truncate flex-1">{alert.title}</span>
                </div>
              ))}
              {location.safetyAlerts.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{location.safetyAlerts.length - 2} more alerts
                </p>
              )}
            </div>
          </div>
        )}

        {/* News Preview */}
        <div className="space-y-2">
          <h4 className="text-sm">Latest News</h4>
          <div className="space-y-1">
            {location.news.slice(0, 2).map((newsItem) => (
              <div key={newsItem.id}>
                <p className="text-xs truncate">{newsItem.title}</p>
                <p className="text-xs text-muted-foreground">{newsItem.source}</p>
              </div>
            ))}
            {location.news.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{location.news.length - 2} more articles
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
