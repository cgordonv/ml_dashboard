import { useMemo, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, ExternalLink } from 'lucide-react';
import type { Location } from '../types/dashboard';

// Ensure Vite/Vercel bundles the fallback asset
import '/public/radar-fallback.png';

/**
 * RainViewer static radar snapshot (no API key).
 * https://tilecache.rainviewer.com/v2/radar/last/{size}/{lat},{lng}/{zoom}/{opacity}_{snow}.png
 */
function buildRadarImageUrl(lat: number, lng: number, size = 768, zoom = 7) {
  const z = Math.min(12, Math.max(3, zoom));
  const cb = Date.now(); // cache-bust
  return `https://tilecache.rainviewer.com/v2/radar/last/${size}/${lat},${lng}/${z}/1_1.png?cb=${cb}`;
}

/** RainViewer live interactive page centered on lat/lng */
function buildLiveRadarLink(lat: number, lng: number, zoom = 7) {
  const z = Math.min(12, Math.max(3, zoom));
  return `https://www.rainviewer.com/map.html?loc=${lat},${lng},${z},oFa`;
}

interface Props {
  location: Location;
}

export function RadarHeader({ location }: Props) {
  const { lat, lng } = location.coordinates;
  const [seed, setSeed] = useState(0);       // force image refresh
  const erroredRef = useRef(false);          // prevent infinite onError loops

  const radarUrl = useMemo(
    () => buildRadarImageUrl(lat, lng) + `&seed=${seed}`,
    [lat, lng, seed]
  );
  const liveUrl = useMemo(() => buildLiveRadarLink(lat, lng), [lat, lng]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Weather Radar <span className="text-muted-foreground">· RainViewer</span>
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              erroredRef.current = false;
              setSeed((s) => s + 1);
            }}
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
            loading="eager"
            decoding="async"
            onError={(e) => {
              if (erroredRef.current) return;
              erroredRef.current = true;
              (e.currentTarget as HTMLImageElement).src = '/radar-fallback.png';
            }}
          />
          <div className="px-4 py-2 text-sm text-muted-foreground text-right">
            Snapshot updates ~every 10 minutes · Use “Live Radar” for interactivity
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
