import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const API_BASE = 'http://localhost:8000';

export default function SizeRecommender({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoulders: '',
    inseam: '',
    fit_preference: 'regular',
    fabric_stretch: 'medium',
    product_type: 'general'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formChanged, setFormChanged] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear previous result when form changes
    if (result) {
      setResult(null);
      setFormChanged(true);
    }
  };

  const parseHeight = (heightStr) => {
    // Handle formats like "5'6", "5 feet 6 inches", "66 inches", "66"
    const cleanStr = heightStr.toLowerCase().replace(/[^0-9'"\s]/g, '');

    // Check for feet'inches format
    const feetInchesMatch = cleanStr.match(/(\d+)\s*[']\s*(\d+)/);
    if (feetInchesMatch) {
      const feet = parseInt(feetInchesMatch[1]);
      const inches = parseInt(feetInchesMatch[2]);
      return feet * 12 + inches;
    }

    // Check for plain number (assume inches)
    const numberMatch = cleanStr.match(/(\d+)/);
    if (numberMatch) {
      return parseFloat(numberMatch[1]);
    }

    throw new Error('Invalid height format. Use format like "5\'6" or "66"');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setFormChanged(false);

    try {
      const requestData = {
        height: parseHeight(formData.height),
        weight: parseFloat(formData.weight),
        fit_preference: formData.fit_preference,
        fabric_stretch: formData.fabric_stretch,
        product_type: formData.product_type
      };

      // Add optional measurements only if provided
      if (formData.chest) requestData.chest = parseFloat(formData.chest);
      if (formData.waist) requestData.waist = parseFloat(formData.waist);
      if (formData.hips) requestData.hips = parseFloat(formData.hips);
      if (formData.shoulders) requestData.shoulders = parseFloat(formData.shoulders);
      if (formData.inseam) requestData.inseam = parseFloat(formData.inseam);

      const response = await fetch(`${API_BASE}/sizing/recommend-size`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Size Recommendation</DialogTitle>
          <DialogDescription>
            Enter your measurements to get personalized size recommendations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Height (e.g., 5'6" or 66 inches)</label>
            <Input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              placeholder="5 feet 6 inches or 66"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
            <Input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              step="0.1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chest (inches)</label>
              <Input
                type="number"
                name="chest"
                value={formData.chest}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waist (inches)</label>
              <Input
                type="number"
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hips (inches)</label>
              <Input
                type="number"
                name="hips"
                value={formData.hips}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shoulders (inches)</label>
              <Input
                type="number"
                name="shoulders"
                value={formData.shoulders}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inseam (inches)</label>
            <Input
              type="number"
              name="inseam"
              value={formData.inseam}
              onChange={handleChange}
              step="0.1"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fit Preference</label>
              <Select name="fit_preference" value={formData.fit_preference} onValueChange={(value) => handleChange({ target: { name: 'fit_preference', value } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fabric Stretch</label>
              <Select name="fabric_stretch" value={formData.fabric_stretch} onValueChange={(value) => handleChange({ target: { name: 'fabric_stretch', value } })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Type (Optional)</label>
            <Select name="product_type" value={formData.product_type} onValueChange={(value) => handleChange({ target: { name: 'product_type', value } })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="sports_bra">Sports Bra</SelectItem>
                <SelectItem value="biker_shorts">Biker Shorts</SelectItem>
                <SelectItem value="tank_top">Tank Top</SelectItem>
                <SelectItem value="scrub_top">Scrub Top</SelectItem>
                <SelectItem value="scrub_bottom">Scrub Bottom</SelectItem>
                <SelectItem value="compression_leggings">Compression Leggings</SelectItem>
                <SelectItem value="yoga_tank">Yoga Tank Top</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Getting Recommendation...' : formChanged ? 'Update Recommendation' : 'Get Size Recommendation'}
          </Button>
        </form>

        {error && (
          <Card className="mt-4 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recommended Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Top Size:</span>
                  <span className="font-medium">{result.top_size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bottom Size:</span>
                  <span className="font-medium">{result.bottom_size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Top Confidence:</span>
                  <span className="font-medium">{(result.top_confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Bottom Confidence:</span>
                  <span className="font-medium">{(result.bottom_confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              {result.notes.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1">Notes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.notes.map((note, index) => (
                      <li key={index}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}