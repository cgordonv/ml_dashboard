import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadarHeader } from './RadarHeader';
import { Location } from '../types/dashboard';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Newspaper,
  MapPin,
  Edit3,
} from 'lucide-react';

interface LocationDetailProps {
  location: Location;
  onBack: () => void;
  onEdit: (location: Location) => void;
}

export function LocationDetail({ location, onBack, onEdit }: LocationDetailProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      case 'watch':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDateTime = (d: string | number | Date) => {
    const date = typeof d === 'number' ? new Date(d) : new Date(d);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const lastUpdated =
    (location.weather as any)?.updatedAt ?? location.lastUpdated ?? Date.now();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Button variant="outline" onClick={() => onEdit(location)}>
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Location
        </Button>
      </div>

      {/* Radar Header */}
      <RadarHeader location={location} />

      {/* Location Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {location.nickname}
              </CardTitle>
              <p className="text-muted-foreground">{location.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {formatDateTime(lastUpdated)}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2">
                <span className="text-4xl">{location.weather?.icon ?? '🌤️'}</span>
                <span className="text-3xl">
                  {typeof location.weather?.temperature === 'number'
                    ? `${location.weather.temperature}°F`
                    : '—'}
                </span>
              </div>
              <p className="text-muted-foreground">
                {location.weather?.condition ?? '—'}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weather Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Weather Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Droplets className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl">
                {typeof location.weather?.humidity === 'number'
                  ? `${location.weather.humidity}%`
                  : '—'}
              </p>
              <p className="text-sm text-muted-foreground">Humidity</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Wind className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl">
                {typeof location.weather?.windSpeed === 'number'
                  ? `${location.weather.windSpeed} mph`
                  : '—'}
              </p>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Thermometer className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl">
                {typeof location.weather?.temperature === 'number'
                  ? `${location.weather.temperature}°F`
                  : '—'}
              </p>
              <p className="text-sm text-muted-foreground">Temperature</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Alerts */}
      {location.safetyAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Safety Alerts ({location.safetyAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {location.safetyAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <h4>{alert.title}</h4>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Issued: {formatDateTime(alert.issuedAt)}</span>
                  {alert.expiresAt && (
                    <span>Expires: {formatDateTime(alert.expiresAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Latest News ({location.news.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {location.news.map((newsItem, index) => (
            <div key={newsItem.id}>
              {index > 0 && <Separator />}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <h4>{newsItem.title}</h4>
                    <p className="text-sm text-muted-foreground">{newsItem.summary}</p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {newsItem.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{newsItem.source}</span>
                  <span>{formatDateTime(newsItem.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
