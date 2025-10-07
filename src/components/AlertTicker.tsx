import { useState, useEffect } from 'react';
import { Location } from '../types/dashboard';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AlertTriangle, Info, X } from 'lucide-react';

interface AlertTickerProps {
  locations: Location[];
  onLocationClick: (location: Location) => void;
}

interface TickerAlert {
  locationId: string;
  locationName: string;
  locationNickname: string;
  alertId: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  type: 'warning' | 'watch' | 'advisory';
}

export function AlertTicker({ locations, onLocationClick }: AlertTickerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Collect all severe alerts from all locations
  const allAlerts: TickerAlert[] = locations.flatMap(location => 
    location.safetyAlerts
      .filter(alert => alert.severity === 'high' || alert.severity === 'medium')
      .map(alert => ({
        locationId: location.id,
        locationName: location.name,
        locationNickname: location.nickname,
        alertId: alert.id,
        title: alert.title,
        severity: alert.severity,
        type: alert.type
      }))
  );

  // Auto-scroll through alerts if there are multiple
  useEffect(() => {
    if (allAlerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allAlerts.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [allAlerts.length]);

  // Don't render if no severe alerts or if dismissed
  if (!isVisible || allAlerts.length === 0) {
    return null;
  }

  const currentAlert = allAlerts[currentIndex];
  const location = locations.find(loc => loc.id === currentAlert.locationId);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800';
      case 'medium':
        return 'bg-orange-500/10 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-800';
      default:
        return 'bg-blue-500/10 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800';
    }
  };

  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    if (severity === 'high') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Info className="h-4 w-4" />;
  };

  return (
    <Card className={`mb-6 border-l-4 ${
      currentAlert.severity === 'high' 
        ? 'border-l-red-500' 
        : currentAlert.severity === 'medium' 
        ? 'border-l-orange-500' 
        : 'border-l-blue-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Alert Icon */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getSeverityColor(currentAlert.severity)}`}>
              {getSeverityIcon(currentAlert.severity)}
            </div>
            
            {/* Alert Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {currentAlert.type.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentAlert.locationNickname}
                </span>
                {allAlerts.length > 1 && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {currentIndex + 1} of {allAlerts.length}
                  </span>
                )}
              </div>
              <p className="text-sm truncate">
                <span className="font-medium">{currentAlert.title}</span>
              </p>
            </div>
            
            {/* Action Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => location && onLocationClick(location)}
              className="flex-shrink-0"
            >
              View Details
            </Button>
          </div>
          
          {/* Dismiss Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="ml-2 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Progress Indicator for Multiple Alerts */}
        {allAlerts.length > 1 && (
          <div className="flex gap-1 mt-3">
            {allAlerts.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-primary' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}