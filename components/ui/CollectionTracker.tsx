'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Trophy, Download, Upload, X } from 'lucide-react';
import { getCollectionStats, exportProgress, importProgress, getAllAchievements } from '@/lib/utils/collections';

export default function CollectionTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState(getCollectionStats());
  const [achievements, setAchievements] = useState(getAllAchievements());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    updateData();

    const handleUpdate = () => updateData();
    window.addEventListener('pokemon-viewed', handleUpdate);
    window.addEventListener('achievement-unlocked', handleUpdate);

    return () => {
      window.removeEventListener('pokemon-viewed', handleUpdate);
      window.removeEventListener('achievement-unlocked', handleUpdate);
    };
  }, []);

  const updateData = () => {
    setStats(getCollectionStats());
    setAchievements(getAllAchievements());
  };

  const handleExport = () => {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pokedex-progress.json';
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        if (importProgress(text)) {
          updateData();
          alert('Progress imported successfully!');
        } else {
          alert('Failed to import progress.');
        }
      }
    };
    input.click();
  };

  if (!mounted) return null;

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 bg-bg-secondary border border-border hover:border-accent text-text-secondary hover:text-accent rounded-full transition-all"
      >
        <Trophy className="w-5 h-5" />
        {stats.completionPercentage > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {stats.completionPercentage}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-bg-primary border border-border rounded-2xl max-w-2xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="bg-bg-primary border-b border-border p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text-primary">Collection Progress</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-bg-secondary rounded-full">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-2">Overall Completion</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-accent">{stats.completionPercentage}%</span>
                    <span className="text-text-secondary">({stats.totalViewed}/1025)</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4">Generation Progress</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.generationProgress).map(([gen, { viewed, total }]) => {
                      const percentage = Math.round((viewed / total) * 100);
                      return (
                        <div key={gen}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-text-secondary">Gen {gen}</span>
                            <span className="text-text-primary">{viewed}/{total}</span>
                          </div>
                          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-4">Achievements ({unlockedCount}/{achievements.length})</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map(achievement => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border ${
                          achievement.unlockedAt
                            ? 'bg-accent/20 border-accent/30'
                            : 'bg-bg-secondary border-border opacity-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{achievement.icon}</div>
                        <p className="font-bold text-text-primary text-sm">{achievement.name}</p>
                        <p className="text-xs text-text-secondary">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white px-4 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Progress
                  </button>
                  <button onClick={handleImport} className="flex-1 flex items-center justify-center gap-2 bg-bg-secondary border border-border text-text-primary px-4 py-3 rounded-lg font-medium hover:border-accent transition-colors">
                    <Upload className="w-4 h-4" />
                    Import Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
