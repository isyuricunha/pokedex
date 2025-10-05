'use client';

import { useState } from 'react';
import { Swords } from 'lucide-react';
import TypeBadge from './TypeBadge';

interface Move {
  move: {
    name: string;
    url: string;
  };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
    version_group: {
      name: string;
    };
  }[];
}

interface MoveListProps {
  moves: Move[];
}

type LearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor' | 'all';

export default function MoveList({ moves }: MoveListProps) {
  const [selectedMethod, setSelectedMethod] = useState<LearnMethod>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get latest version group details for each move
  const processedMoves = moves.map(move => {
    const latestDetails = move.version_group_details[move.version_group_details.length - 1];
    return {
      name: move.move.name,
      level: latestDetails.level_learned_at,
      method: latestDetails.move_learn_method.name,
      versionGroup: latestDetails.version_group.name,
    };
  });

  // Filter by learn method
  let filteredMoves = selectedMethod === 'all' 
    ? processedMoves 
    : processedMoves.filter(m => m.method === selectedMethod);

  // Filter by search query
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredMoves = filteredMoves.filter(m => 
      m.name.toLowerCase().includes(query)
    );
  }

  // Sort by level (level-up) or alphabetically
  filteredMoves.sort((a, b) => {
    if (selectedMethod === 'level-up' && a.level > 0 && b.level > 0) {
      return a.level - b.level;
    }
    return a.name.localeCompare(b.name);
  });

  const getMethodBadge = (method: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      'level-up': { label: 'Level', color: 'bg-blue-500' },
      'machine': { label: 'TM/HM', color: 'bg-purple-500' },
      'egg': { label: 'Egg', color: 'bg-green-500' },
      'tutor': { label: 'Tutor', color: 'bg-orange-500' },
    };
    
    const badge = badges[method] || { label: method, color: 'bg-gray-500' };
    return (
      <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <Swords className="w-6 h-6 text-accent" />
        <h2 className="text-2xl font-bold text-text-primary">Moves</h2>
        <span className="text-sm text-text-secondary">
          ({filteredMoves.length} moves)
        </span>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Learn Method Filter */}
        <div>
          <label className="block text-xs text-text-secondary mb-2">
            Learn Method
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as LearnMethod)}
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="all">All Methods</option>
            <option value="level-up">Level Up</option>
            <option value="machine">TM/HM</option>
            <option value="egg">Egg Move</option>
            <option value="tutor">Move Tutor</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs text-text-secondary mb-2">
            Search Moves
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search move name..."
            className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Moves List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredMoves.length > 0 ? (
          filteredMoves.map((move, index) => (
            <div
              key={`${move.name}-${index}`}
              className="bg-bg-primary border border-border rounded-lg p-3 flex items-center justify-between hover:border-accent transition-colors"
            >
              <div className="flex-1">
                <p className="text-text-primary font-medium capitalize">
                  {move.name.replace('-', ' ')}
                </p>
                {move.level > 0 && (
                  <p className="text-xs text-text-secondary">
                    Learn at Level {move.level}
                  </p>
                )}
              </div>
              <div>
                {getMethodBadge(move.method)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-text-secondary">
            No moves found
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-4 text-xs text-text-secondary bg-bg-primary border border-border rounded-lg p-3">
        <p>
          💡 <strong>Note:</strong> Moves shown are from the latest game version. 
          Level-up moves are sorted by level, others alphabetically.
        </p>
      </div>
    </div>
  );
}
