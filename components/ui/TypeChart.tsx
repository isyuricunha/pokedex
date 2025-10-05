'use client';

import { useState } from 'react';
import { ALL_TYPES, getTypeEffectiveness, getEffectivenessLabel } from '@/lib/utils/type-chart';

export default function TypeChart() {
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null);
  const [selectedDefense, setSelectedDefense] = useState<string | null>(null);

  const effectiveness = selectedAttack && selectedDefense 
    ? getTypeEffectiveness(selectedAttack, selectedDefense) 
    : null;

  const getEffectivenessBg = (attack: string, defense: string) => {
    const eff = getTypeEffectiveness(attack, defense);
    if (eff === 0) return 'bg-gray-500/50';
    if (eff === 0.5) return 'bg-red-500/50';
    if (eff === 2) return 'bg-green-500/50';
    return 'bg-bg-secondary';
  };

  return (
    <div className="space-y-6">
      {/* Selection UI */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Attack Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedAttack(type)}
                className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                  selectedAttack === type
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Defense Type</h3>
          <div className="grid grid-cols-3 gap-2">
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedDefense(type)}
                className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all ${
                  selectedDefense === type
                    ? 'bg-accent text-white'
                    : 'bg-bg-primary border border-border text-text-primary hover:border-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      {effectiveness !== null && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-2xl p-8 text-center">
          <p className="text-text-secondary mb-2">
            <span className="capitalize font-bold text-accent">{selectedAttack}</span> attacking{' '}
            <span className="capitalize font-bold text-accent">{selectedDefense}</span>
          </p>
          <p className="text-5xl font-bold text-text-primary mb-2">{effectiveness}×</p>
          <p className="text-xl text-accent font-bold">{getEffectivenessLabel(effectiveness)}</p>
        </div>
      )}

      {/* Full Chart */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Full Type Chart</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-2 text-text-secondary sticky left-0 bg-bg-secondary">Attack →<br/>Defense ↓</th>
                {ALL_TYPES.map(type => (
                  <th key={type} className="p-2 capitalize text-text-primary">{type}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_TYPES.map(defType => (
                <tr key={defType}>
                  <td className="p-2 capitalize font-bold text-text-primary sticky left-0 bg-bg-secondary">
                    {defType}
                  </td>
                  {ALL_TYPES.map(atkType => {
                    const eff = getTypeEffectiveness(atkType, defType);
                    return (
                      <td
                        key={atkType}
                        className={`p-2 text-center ${getEffectivenessBg(atkType, defType)}`}
                      >
                        {eff === 1 ? '−' : eff === 0 ? '0' : `${eff}×`}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500/50 border border-green-500 rounded"></div>
            <span className="text-text-secondary">2× Super Effective</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-bg-secondary border border-border rounded"></div>
            <span className="text-text-secondary">1× Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500/50 border border-red-500 rounded"></div>
            <span className="text-text-secondary">0.5× Not Very Effective</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-500/50 border border-gray-500 rounded"></div>
            <span className="text-text-secondary">0× No Effect</span>
          </div>
        </div>
      </div>
    </div>
  );
}
