'use client';

import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import { getPreferences, savePreferences, resetPreferences, UserPreferences } from '@/lib/utils/preferences';

export default function PreferencesPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(getPreferences());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPreferences(getPreferences());
  }, []);

  const handleSave = (updates: Partial<UserPreferences>) => {
    const updated = savePreferences(updates);
    setPreferences(updated);
  };

  const handleReset = () => {
    if (confirm('Reset all preferences to default?')) {
      const defaults = resetPreferences();
      setPreferences(defaults);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-bg-secondary border border-border hover:border-accent text-text-secondary hover:text-accent rounded-full transition-all"
        aria-label="Open preferences"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-bg-primary border border-border rounded-2xl max-w-2xl w-full my-8">
            {/* Header */}
            <div className="sticky top-0 bg-bg-primary border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-primary">Preferences</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  View Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSave({ viewMode: 'grid' })}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      preferences.viewMode === 'grid'
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => handleSave({ viewMode: 'list' })}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      preferences.viewMode === 'list'
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Sprite Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Sprite Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSave({ spriteType: 'official' })}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      preferences.spriteType === 'official'
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    Official
                  </button>
                  <button
                    onClick={() => handleSave({ spriteType: 'pixel' })}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      preferences.spriteType === 'pixel'
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    Pixel
                  </button>
                  <button
                    onClick={() => handleSave({ spriteType: '3d' })}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      preferences.spriteType === '3d'
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>

              {/* Card Size */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Card Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => handleSave({ cardSize: size })}
                      className={`py-3 px-4 rounded-lg font-medium capitalize transition-all ${
                        preferences.cardSize === size
                          ? 'bg-accent text-white'
                          : 'bg-bg-secondary border border-border text-text-primary hover:border-accent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-bg-secondary border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <span className="text-text-primary font-medium">Show Pokédex Numbers</span>
                  <input
                    type="checkbox"
                    checked={preferences.showPokedexNumbers}
                    onChange={(e) => handleSave({ showPokedexNumbers: e.target.checked })}
                    className="w-5 h-5 accent-accent"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-bg-secondary border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <span className="text-text-primary font-medium">Enable Animations</span>
                  <input
                    type="checkbox"
                    checked={preferences.animationsEnabled}
                    onChange={(e) => handleSave({ animationsEnabled: e.target.checked })}
                    className="w-5 h-5 accent-accent"
                  />
                </label>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full py-3 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
