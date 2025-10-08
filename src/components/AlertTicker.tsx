import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Location, SafetyAlert } from '../types/dashboard';

interface Props {
  locations: Location[];
  onLocationClick: (location: Location) => void;
}

type AlertWithLoc = SafetyAlert & { __loc: Location };

function severityClass(sev: SafetyAlert['severity']) {
  switch (sev) {
    case 'critical': return 'bg-red-600 text-white';
    case 'high':     return 'bg-red-500 text-white';
    case 'medium':   return 'bg-yellow-500 text-white';
    case 'low':      return 'bg-blue-500 text-white';
    default:         return 'bg-gray-500 text-white';
  }
}

export function AlertTicker({ locations, onLocationClick }: Props) {
  // Flatten all alerts across locations, newest first
  const alerts = useMemo<AlertWithLoc[]>(() => {
    const list: AlertWithLoc[] = [];
    for (const loc of locations) {
      for (const a of loc.safetyAlerts || []) {
        list.push({ ...a, __loc: loc });
      }
    }
    // sort by issuedAt desc if present
    list.sort((a, b) => {
      const ta = a.issuedAt ? Date.parse(a.issuedAt) : 0;
      const tb = b.issuedAt ? Date.parse(b.issuedAt) : 0;
      return tb - ta;
    });
    return list;
  }, [locations]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Auto-advance the carousel
  useEffect(() => {
    if (!alerts.length) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(id);
  }, [alerts.length]);

  // Scroll to active item
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !alerts.length) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [index, alerts.length]);

  return (
    <Card className="border border-muted">
      <CardContent className="py-3">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
          <div className="font-medium">
            Safety Alerts
            <span className="text-muted-foreground ml-2">
              ({alerts.length})
            </span>
          </div>

          {/* Carousel controls */}
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIndex((i) => (i - 1 + Math.max(alerts.length, 1)) % Math.max(alerts.length, 1))}
              disabled={!alerts.length}
              title="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIndex((i) => (i + 1) % Math.max(alerts.length, 1))}
              disabled={!alerts.length}
              title="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Strip */}
        {alerts.length ? (
          <div
            ref={scrollerRef}
            className="mt-3 flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1"
          >
            {alerts.map((a, i) => (
              <button
                key={a.id + '-' + i}
                className="snap-center shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 bg-card hover:bg-accent transition-colors"
                onClick={() => onLocationClick(a.__loc)}
                title={`View ${a.__loc.nickname || a.__loc.name}`}
              >
                <Badge className={`mr-2 ${severityClass(a.severity)}`}>{a.severity}</Badge>
                <span className="font-medium">{a.title}</span>
                <span className="text-muted-foreground ml-2">
                  · {a.__loc.nickname || a.__loc.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 text-sm text-muted-foreground">
            No active alerts right now.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
