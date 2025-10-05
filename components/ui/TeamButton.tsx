'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { getActiveTeamId, getTeam, saveTeam } from '@/lib/utils/team';

interface TeamButtonProps {
  pokemonId: number;
  size?: 'sm' | 'md' | 'lg';
}

const MAX_TEAM_SIZE = 6;

export default function TeamButton({ pokemonId, size = 'md' }: TeamButtonProps) {
  const [inTeam, setInTeam] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [mounted, setMounted] = useState(false);

  const updateState = () => {
    const activeId = getActiveTeamId();
    if (!activeId) {
      setInTeam(false);
      setIsFull(false);
      return;
    }

    const team = getTeam(activeId);
    if (!team) {
      setInTeam(false);
      setIsFull(false);
      return;
    }

    setInTeam(team.members.some(m => m.pokemonId === pokemonId));
    setIsFull(team.members.length >= MAX_TEAM_SIZE);
  };

  useEffect(() => {
    setMounted(true);
    updateState();

    const handleUpdate = () => updateState();
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('team-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('team-updated', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const activeId = getActiveTeamId();
    if (!activeId) {
      alert('Please create or select a team first!');
      return;
    }

    const team = getTeam(activeId);
    if (!team) {
      alert('Team not found');
      return;
    }

    if (inTeam) {
      // Remove from team
      const updatedMembers = team.members.filter(m => m.pokemonId !== pokemonId);
      saveTeam({ ...team, members: updatedMembers });
    } else {
      if (team.members.length >= MAX_TEAM_SIZE) {
        alert('Team is full! Maximum 6 Pokémon per team.');
        return;
      }
      // Add to team
      const updatedMembers = [...team.members, { pokemonId }];
      saveTeam({ ...team, members: updatedMembers });
    }

    updateState();
    window.dispatchEvent(new Event('team-updated'));
  };

  if (!mounted) return null;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const isDisabled = !inTeam && isFull;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${
        inTeam
          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
          : isDisabled
          ? 'bg-bg-secondary border border-border text-text-secondary opacity-50 cursor-not-allowed'
          : 'bg-bg-secondary border border-border text-text-secondary hover:border-green-500 hover:text-green-500'
      }`}
      aria-label={inTeam ? 'Remove from team' : 'Add to team'}
      title={isDisabled ? 'Team is full' : undefined}
    >
      {inTeam ? (
        <Check className={`${iconSizes[size]}`} />
      ) : (
        <UserPlus className={`${iconSizes[size]}`} />
      )}
    </button>
  );
}
