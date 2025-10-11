// src/components/RadarHeader.tsx
import React from "react";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

interface RadarHeaderProps {
  lat: number;
  lng: number;
  locationName?: string;
}

export const RadarHeader: React.FC<RadarHeaderProps> = ({ lat, lng, locationName }) => {
  const zoom = 8;

  // Static radar snapshot from RainViewer (PNG tile)
  const radarImage = `https://tilecache.rainviewer.com/v2/radar/last/768/${lat},${lng}/${zoom}/1_1.png`;

  // Live interactive radar map
  const radarLink = `https://www.rainviewer.com/map.html?loc=${lat},${lng},${zoom},oFa`;

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm border border-border bg-muted/30">
      <img
        src={radarImage}
        alt={`Radar for ${locationName || "location"}`}
        className="w-full h-48 object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/radar-fallback.png";
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {locationName || "Current Location"}
            </h2>
            <p className="text-sm text-muted-foreground">Weather Radar Snapshot</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(radarLink, "_blank")}
          >
            View Live Radar
          </Button>
        </div>
      </div>
    </div>
  );
};
