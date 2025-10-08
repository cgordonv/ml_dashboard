import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { Location } from '../types/dashboard';
import { buildRadarImageUrl, buildLiveRadarLink } from '../services/api';

interface Props {
  location: Location;
}

export function RadarHeader({ location }: Props) {
  const { lat, lng } = location.coordinates;
  const [seed, setSeed] = useState(0); // force-refresh the image

  const radarUrl = useMemo(
    () => buildRadarImageUrl(lat, lng) + `&seed=${seed}`,
    [lat, lng, seed]
  );
  const liveUrl = useMemo(() => buildLiveRadarLink(lat, lng), [lat, lng]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span>Weather Radar</span>
          <span className="text-muted-foreground">· RainViewer</span>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSeed((s) => s + 1)}
            title="Refresh radar image"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild variant="outline" size="sm" title="Open live radar">
            <a href={liveUrl} target="_blank" rel="noreferrer">
              Live Radar <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl overflow-hidden bg-muted/40">
          <img
            src={radarUrl}
            alt="Latest radar snapshot"
            className="w-full h-64 object-cover"
            onError={(e) => {
              // graceful fallback
              (e.currentTarget as HTMLImageElement).src =
                'https://radar.weather.gov/ridge/standard/CONUS_0.gif';
            }}
          />
          <div className="px-4 py-2 text-sm text-muted-foreground text-right">
            Current radar snapshot • Click “Live Radar” for interactive map
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
