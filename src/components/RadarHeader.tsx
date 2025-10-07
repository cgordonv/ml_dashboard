import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Location } from '../types/dashboard';
import { Radar, ExternalLink, RefreshCw } from 'lucide-react';

interface RadarHeaderProps {
  location: Location;
}

export function RadarHeader({ location }: RadarHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Generate AccuWeather radar URL based on coordinates
  const getRadarImageUrl = (lat: number, lng: number) => {
    // Mock AccuWeather radar image URL - in a real app, you'd use their API
    return `https://maps.accuweather.com/maps/satellite?lat=${lat}&lng=${lng}&zoom=8&width=400&height=200&language=en-us`;
  };

  // Generate live radar URL for AccuWeather
  const getLiveRadarUrl = (lat: number, lng: number) => {
    return `https://www.accuweather.com/en/us/weather-radar?lat=${lat}&lng=${lng}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewLiveRadar = () => {
    const url = getLiveRadarUrl(location.coordinates.lat, location.coordinates.lng);
    window.open(url, '_blank');
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            <h3 className="text-sm">Weather Radar</h3>
            <span className="text-xs text-muted-foreground">• AccuWeather</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewLiveRadar}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Live Radar
            </Button>
          </div>
        </div>
        
        <div className="relative rounded-lg overflow-hidden bg-muted/30">
          <img
            src={getRadarImageUrl(location.coordinates.lat, location.coordinates.lng)}
            alt={`Weather radar for ${location.name}`}
            className="w-full h-32 object-cover"
            onError={(e) => {
              // Fallback to a placeholder if the radar image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/400x200/e2e8f0/64748b?text=Radar+Unavailable`;
            }}
          />
          
          {/* Overlay with location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
          
          {/* Timestamp overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} EST
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Current radar conditions • Click "Live Radar" for interactive map
        </p>
      </CardContent>
    </Card>
  );
}