import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Location } from '../types/dashboard';
import { mockLocations } from '../data/mockData';

interface AddLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  editingLocation?: Location | null;
}

export function AddLocationDialog({ 
  isOpen, 
  onClose, 
  onSave, 
  editingLocation 
}: AddLocationDialogProps) {
  const [formData, setFormData] = useState({
    name: editingLocation?.name || '',
    nickname: editingLocation?.nickname || '',
    lat: editingLocation?.coordinates.lat?.toString() || '',
    lng: editingLocation?.coordinates.lng?.toString() || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.nickname) {
      return;
    }

    // Generate mock data for new location
    const newLocation: Location = {
      id: editingLocation?.id || Date.now().toString(),
      name: formData.name,
      nickname: formData.nickname,
      coordinates: {
        lat: parseFloat(formData.lat) || 40.7128,
        lng: parseFloat(formData.lng) || -74.0060
      },
      weather: editingLocation?.weather || {
        temperature: Math.floor(Math.random() * 40) + 50,
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        icon: ['☀️', '☁️', '⛅', '🌧️'][Math.floor(Math.random() * 4)]
      },
      news: editingLocation?.news || [
        {
          id: `n${Date.now()}`,
          title: 'Local News Update',
          summary: 'Stay informed with the latest local developments...',
          source: 'Local News',
          publishedAt: new Date().toISOString(),
          category: 'Local'
        }
      ],
      safetyAlerts: editingLocation?.safetyAlerts || [],
      lastUpdated: new Date().toISOString()
    };

    onSave(newLocation);
    setFormData({ name: '', nickname: '', lat: '', lng: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', nickname: '', lat: '', lng: '' });
    onClose();
  };

  // Preset locations for quick selection
  const presetLocations = [
    { name: 'Seattle, WA', lat: 47.6062, lng: -122.3321 },
    { name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
    { name: 'Denver, CO', lat: 39.7392, lng: -104.9903 },
    { name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
    { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 }
  ];

  const fillPreset = (preset: typeof presetLocations[0]) => {
    setFormData({
      name: preset.name,
      nickname: preset.name.split(',')[0], // Use city name as default nickname
      lat: preset.lat.toString(),
      lng: preset.lng.toString()
    });
  };

  return (
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent aria-describedby="add-location-desc">
    <DialogHeader>
      <DialogTitle>Add Location</DialogTitle>
      <DialogDescription id="add-location-desc">
        Enter a city and optional nickname. We’ll fetch weather, alerts, and local news.
      </DialogDescription>
    </DialogHeader>
    {/* ... */}
  </DialogContent>
</Dialog>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name</Label>
            <Input
              id="name"
              placeholder="e.g., San Francisco, CA"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="e.g., Golden Gate City"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="37.7749"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="-122.4194"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              />
            </div>
          </div>

          {!editingLocation && (
            <div className="space-y-2">
              <Label>Quick Select</Label>
              <div className="grid grid-cols-1 gap-1">
                {presetLocations.map((preset) => (
                  <Button
                    key={preset.name}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-8"
                    onClick={() => fillPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingLocation ? 'Save Changes' : 'Add Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}