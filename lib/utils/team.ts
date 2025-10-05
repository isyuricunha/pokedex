// Team management with localStorage

const TEAMS_KEY = 'pokedex-teams';
const ACTIVE_TEAM_KEY = 'pokedex-active-team';

export interface TeamMember {
  pokemonId: number;
  nickname?: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Get all saved teams
 */
export function getTeams(): Team[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const teams = localStorage.getItem(TEAMS_KEY);
    return teams ? JSON.parse(teams) : [];
  } catch (error) {
    console.error('Error reading teams:', error);
    return [];
  }
}

/**
 * Get a specific team by ID
 */
export function getTeam(teamId: string): Team | null {
  const teams = getTeams();
  return teams.find(t => t.id === teamId) || null;
}

/**
 * Save a team (create or update)
 */
export function saveTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Team {
  if (typeof window === 'undefined') return { ...team, id: '', createdAt: 0, updatedAt: 0, members: [] };
  
  const teams = getTeams();
  const now = Date.now();
  
  if (team.id) {
    // Update existing team
    const index = teams.findIndex(t => t.id === team.id);
    if (index !== -1) {
      teams[index] = {
        ...teams[index],
        ...team,
        updatedAt: now,
      };
      localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
      return teams[index];
    }
  }
  
  // Create new team
  const newTeam: Team = {
    id: `team-${now}-${Math.random().toString(36).substr(2, 9)}`,
    name: team.name,
    members: team.members,
    createdAt: now,
    updatedAt: now,
  };
  
  teams.push(newTeam);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  return newTeam;
}

/**
 * Delete a team
 */
export function deleteTeam(teamId: string): void {
  if (typeof window === 'undefined') return;
  
  const teams = getTeams();
  const filtered = teams.filter(t => t.id !== teamId);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(filtered));
  
  // Clear active team if it was deleted
  if (getActiveTeamId() === teamId) {
    clearActiveTeam();
  }
}

/**
 * Get active team ID
 */
export function getActiveTeamId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_TEAM_KEY);
}

/**
 * Set active team
 */
export function setActiveTeam(teamId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_TEAM_KEY, teamId);
}

/**
 * Clear active team
 */
export function clearActiveTeam(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_TEAM_KEY);
}

/**
 * Export team to JSON
 */
export function exportTeamToJSON(team: Team): string {
  return JSON.stringify(team, null, 2);
}

/**
 * Import team from JSON
 */
export function importTeamFromJSON(json: string): Team | null {
  try {
    const team = JSON.parse(json);
    if (team.name && Array.isArray(team.members)) {
      return saveTeam({
        name: team.name,
        members: team.members,
      });
    }
    return null;
  } catch (error) {
    console.error('Error importing team:', error);
    return null;
  }
}

/**
 * Export team to Pokémon Showdown format
 */
export function exportTeamToShowdown(team: Team, pokemonData: { id: number; name: string }[]): string {
  const lines: string[] = [];
  
  team.members.forEach(member => {
    const pokemon = pokemonData.find(p => p.id === member.pokemonId);
    if (pokemon) {
      const nickname = member.nickname || pokemon.name;
      lines.push(`${nickname} (${pokemon.name})`);
      lines.push(''); // Empty line between Pokemon
    }
  });
  
  return lines.join('\n');
}

/**
 * Generate shareable URL for team
 */
export function generateTeamShareURL(team: Team): string {
  const pokemonIds = team.members.map(m => m.pokemonId).join(',');
  const params = new URLSearchParams({
    p: pokemonIds,
    name: team.name,
  });
  
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/team?${params.toString()}`;
  }
  
  return `/team?${params.toString()}`;
}

/**
 * Parse team from URL params
 */
export function parseTeamFromURL(searchParams: URLSearchParams): Omit<Team, 'id' | 'createdAt' | 'updatedAt'> | null {
  const pokemonParam = searchParams.get('p');
  const name = searchParams.get('name') || 'Shared Team';
  
  if (!pokemonParam) return null;
  
  const pokemonIds = pokemonParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id) && id > 0);
  
  if (pokemonIds.length === 0) return null;
  
  return {
    name,
    members: pokemonIds.map(pokemonId => ({ pokemonId })),
  };
}
