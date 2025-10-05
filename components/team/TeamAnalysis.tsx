'use client';

import { Pokemon } from '@/lib/types/pokemon';
import { analyzeWeaknesses, calculateTeamStats, identifyRole, calculateSynergyScore } from '@/lib/utils/team-analysis';
import { BarChart3, Shield, Zap } from 'lucide-react';
import TypeBadge from '@/components/pokemon/TypeBadge';

interface TeamAnalysisProps {
  team: Pokemon[];
}

export default function TeamAnalysis({ team }: TeamAnalysisProps) {
  if (team.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-2xl p-8 text-center">
        <p className="text-text-secondary">Add Pokémon to your team to see analysis</p>
      </div>
    );
  }

  const teamTypes = team.map(p => ({
    pokemonId: p.id,
    types: p.types.map(t => t.type.name),
  }));

  const teamStats = team.map(p => ({
    pokemonId: p.id,
    hp: p.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
    attack: p.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
    defense: p.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
    spAttack: p.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
    spDefense: p.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
    speed: p.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
  }));

  const roles = teamStats.reduce((acc, stats) => {
    const role = identifyRole(stats);
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weakness = analyzeWeaknesses(teamTypes);
  const stats = calculateTeamStats(teamStats);
  const synergy = calculateSynergyScore(teamTypes, roles);

  return (
    <div className="space-y-6">
      {/* Synergy Score */}
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-accent" />
            <h3 className="text-xl font-bold text-text-primary">Team Synergy</h3>
          </div>
          <div className="text-4xl font-bold text-accent">{synergy}%</div>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold text-text-primary">Weakness Analysis</h3>
        </div>

        {weakness.commonWeaknesses.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-red-400 font-medium mb-2">⚠️ Common Weaknesses (3+ Pokémon weak):</p>
            <div className="flex flex-wrap gap-2">
              {weakness.commonWeaknesses.map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}

        {weakness.commonResistances.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-green-400 font-medium mb-2">✓ Common Resistances:</p>
            <div className="flex flex-wrap gap-2">
              {weakness.commonResistances.map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}

        {weakness.immunities.length > 0 && (
          <div>
            <p className="text-sm text-blue-400 font-medium mb-2">🛡️ Immunities:</p>
            <div className="flex flex-wrap gap-2">
              {weakness.immunities.map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold text-text-primary">Team Stats</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-secondary">Total HP</p>
            <p className="text-lg font-bold text-text-primary">{stats.totalHP}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total Attack</p>
            <p className="text-lg font-bold text-text-primary">{stats.totalAttack}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total Defense</p>
            <p className="text-lg font-bold text-text-primary">{stats.totalDefense}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Average BST</p>
            <p className="text-lg font-bold text-accent">{stats.averageTotal}</p>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-bg-secondary border border-border rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Role Distribution</h3>
        <div className="space-y-2">
          {Object.entries(roles).map(([role, count]) => (
            <div key={role} className="flex items-center justify-between">
              <span className="text-text-secondary capitalize">{role.replace('-', ' ')}</span>
              <span className="text-text-primary font-medium">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
