import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:8000';

export default function SizeRecommenderDay22({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoulders: '',
    inseam: '',
    fit_preference: 'regular',
    fabric_stretch: 'medium'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref for autofocus
  const heightInputRef = useRef(null);

  // Autofocus on first input when component mounts
  useEffect(() => {
    if (isOpen && heightInputRef.current) {
      heightInputRef.current.focus();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Show "Calculating size..." for 2 seconds minimum
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    try {
      const requestData = {
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        fit_preference: formData.fit_preference,
        fabric_stretch: formData.fabric_stretch
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

      // Log to console as specified
      console.log('Recommended Size:', data);

      // Clear loading after API response if it took less than 2 seconds
      clearTimeout(loadingTimeout);
      setTimeout(() => setLoading(false), 0);

    } catch (err) {
      setError(err.message);
      clearTimeout(loadingTimeout);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-zinc-100 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Interactive Size Recommender (Day 22)</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Height (inches)</label>
              <input
                ref={heightInputRef}
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
                min="48"
                step="0.1"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                step="0.1"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Chest (inches)</label>
              <input
                type="number"
                name="chest"
                value={formData.chest}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Waist (inches)</label>
              <input
                type="number"
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hips (inches)</label>
              <input
                type="number"
                name="hips"
                value={formData.hips}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shoulders (inches)</label>
              <input
                type="number"
                name="shoulders"
                value={formData.shoulders}
                onChange={handleChange}
                step="0.1"
                placeholder="Optional"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inseam (inches)</label>
            <input
              type="number"
              name="inseam"
              value={formData.inseam}
              onChange={handleChange}
              step="0.1"
              placeholder="Optional"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fit Preference</label>
              <select
                name="fit_preference"
                value={formData.fit_preference}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="slim">Slim</option>
                <option value="regular">Regular</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fabric Stretch</label>
              <select
                name="fabric_stretch"
                value={formData.fabric_stretch}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded transition-colors hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            {loading ? 'Calculating size...' : 'Get Size Recommendation'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-zinc-800 rounded">
            <h3 className="font-semibold mb-2">Recommended Sizes</h3>
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
                <ul className="text-sm text-zinc-300 space-y-1">
                  {result.notes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}