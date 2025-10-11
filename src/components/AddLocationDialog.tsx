import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import type { Location } from "../types/dashboard";
import { geocodeLocation, fetchWeatherData, fetchSafetyAlerts, fetchNewsDataForLocation } from "../services/api";

interface AddLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  editingLocation: Location | null;
}

export default function AddLocationDialog({
  isOpen,
  onClose,
  onSave,
  editingLocation,
}: AddLocationDialogProps) {
  const [query, setQuery] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = useMemo(() => !!editingLocation, [editingLocation]);

  // Initialize fields when dialog opens or editing target changes
  useEffect(() => {
    if (isOpen) {
      setQuery(editingLocation?.name || "");
      setNickname(editingLocation?.nickname || "");
      setIsSaving(false);
    }
  }, [isOpen, editingLocation]);

  const canSave = query.trim().length > 0 && nickname.trim().length > 0 && !isSaving;

  const handleSubmit = async () => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      // 1) Geocode user input to get lat/lng + canonical displayed name
      const matches = await geocodeLocation(query.trim());
      if (!matches || matches.length === 0) {
        alert("Could not find that location. Try 'City, State' or 'City, Country'.");
        setIsSaving(false);
        return;
      }
      const best = matches[0]; // { name, lat, lng }

      // 2) Fetch weather + alerts
      const [wx, alerts] = await Promise.all([
        fetchWeatherData(best.lat, best.lng),
        fetchSafetyAlerts(best.lat, best.lng),
      ]);

      // 3) Fetch local English news using city name (with country bias in the proxy)
      const city = wx?.locationName || best.name || query.trim();
      const countryCode = (wx as any)?.countryCode || "us";
      const news = await fetchNewsDataForLocation(city, countryCode);

      // Build the Location object
      const nowMs = wx?.updatedAt ?? Date.now();
      const newLoc: Location = {
        id: editingLocation?.id || uuid(),
        name: best.name,
        nickname: nickname.trim(),
        coordinates: { lat: best.lat, lng: best.lng },
        weather: {
          temperature: wx?.temperature ?? 0,
          condition: wx?.condition ?? "—",
          icon: wx?.icon ?? "🌤️",
          humidity: wx?.humidity ?? 0,
          windSpeed: wx?.windSpeed ?? 0,
          // @ts-ignore (ok to store ms here for display elsewhere)
          updatedAt: nowMs,
        } as any,
        safetyAlerts: alerts ?? [],
        news: news ?? [],
        lastUpdated: nowMs,
      };

      onSave(newLoc);
      onClose();
    } catch (e) {
      console.error("AddLocationDialog save error:", e);
      alert("Sorry, we couldn’t add that location. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent aria-describedby="add-location-desc">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Location" : "Add Location"}</DialogTitle>
          <DialogDescription id="add-location-desc">
            Enter a city (e.g., <em>Greenville, SC</em>) and a nickname. We’ll fetch weather, alerts, and local news.
          </DialogDescription>
        </DialogHeader>

        {/* Form body */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location-query">Location</Label>
            <Input
              id="location-query"
              placeholder="City, State or City, Country"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="Add a short label (e.g., Home, Office)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSave}>
            {isSaving ? "Saving…" : isEdit ? "Save Changes" : "Add Location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
