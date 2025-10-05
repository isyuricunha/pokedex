'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Share2, Download, Upload, Users } from 'lucide-react';
import { Team, getTeams, saveTeam, deleteTeam, getActiveTeamId, setActiveTeam, generateTeamShareURL, parseTeamFromURL, exportTeamToJSON, importTeamFromJSON } from '@/lib/utils/team';
import { getPokemon } from '@/lib/api/pokeapi';
import { Pokemon } from '@/lib/types/pokemon';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamAnalysis from '@/components/team/TeamAnalysis';
import ThemeToggle from '@/components/ui/ThemeToggle';

const MAX_TEAM_SIZE = 6;

function TeamPageContent() {
  const searchParams = useSearchParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeamState] = useState<Team | null>(null);
  const [teamPokemon, setTeamPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const loadedTeams = getTeams();
    setTeams(loadedTeams);

    const sharedTeam = parseTeamFromURL(searchParams);
    if (sharedTeam) {
      const saved = saveTeam(sharedTeam);
      setActiveTeamState(saved);
      setActiveTeam(saved.id);
      loadTeamPokemon(saved);
    } else {
      const activeId = getActiveTeamId();
      if (activeId) {
        const team = loadedTeams.find(t => t.id === activeId);
        if (team) {
          setActiveTeamState(team);
          loadTeamPokemon(team);
        }
      }
    }

    setLoading(false);
  }, [mounted, searchParams]);

  async function loadTeamPokemon(team: Team) {
    try {
      const pokemonPromises = team.members.map(m => getPokemon(m.pokemonId.toString()));
      const pokemon = await Promise.all(pokemonPromises);
      setTeamPokemon(pokemon);
    } catch (error) {
      console.error('Error loading team Pokemon:', error);
    }
  }

  function handleCreateTeam() {
    if (!newTeamName.trim()) return;

    const newTeam = saveTeam({
      name: newTeamName,
      members: [],
    });

    setTeams([...getTeams()]);
    setActiveTeamState(newTeam);
    setActiveTeam(newTeam.id);
    setNewTeamName('');
    setShowNewTeamDialog(false);
    setTeamPokemon([]);
  }

  function handleSelectTeam(team: Team) {
    setActiveTeamState(team);
    setActiveTeam(team.id);
    loadTeamPokemon(team);
  }

  function handleDeleteTeam(teamId: string) {
    if (confirm('Are you sure you want to delete this team?')) {
      deleteTeam(teamId);
      setTeams(getTeams());
      if (activeTeam?.id === teamId) {
        setActiveTeamState(null);
        setTeamPokemon([]);
      }
    }
  }

  function handleRemovePokemon(pokemonId: number) {
    if (!activeTeam) return;

    const updatedMembers = activeTeam.members.filter(m => m.pokemonId !== pokemonId);
    const updated = saveTeam({ ...activeTeam, members: updatedMembers });
    setActiveTeamState(updated);
    setTeams(getTeams());
    setTeamPokemon(teamPokemon.filter(p => p.id !== pokemonId));
  }

  function handleShareTeam() {
    if (!activeTeam) return;
    const url = generateTeamShareURL(activeTeam);
    navigator.clipboard.writeText(url);
    alert('Team URL copied to clipboard!');
  }

  function handleExportJSON() {
    if (!activeTeam) return;
    const json = exportTeamToJSON(activeTeam);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTeam.name}.json`;
    a.click();
  }

  function handleImportJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        const imported = importTeamFromJSON(text);
        if (imported) {
          setTeams(getTeams());
          setActiveTeamState(imported);
          setActiveTeam(imported.id);
          loadTeamPokemon(imported);
          alert('Team imported successfully!');
        } else {
          alert('Failed to import team. Invalid format.');
        }
      }
    };
    input.click();
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to PokéDex
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-accent" />
          <h1 className="text-4xl font-bold text-text-primary">Team Builder</h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-bg-secondary border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">My Teams</h2>
                <button
                  onClick={() => setShowNewTeamDialog(true)}
                  className="p-2 bg-accent hover:bg-accent/90 text-white rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showNewTeamDialog && (
                <div className="mb-4 p-4 bg-bg-primary border border-border rounded-xl">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Team name..."
                    className="w-full bg-bg-secondary border border-border rounded-lg px-3 py-2 text-text-primary mb-2"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                  />
                  <div className="flex gap-2">
                    <button onClick={handleCreateTeam} className="flex-1 bg-accent text-white px-3 py-1 rounded-lg text-sm">
                      Create
                    </button>
                    <button onClick={() => setShowNewTeamDialog(false)} className="flex-1 bg-bg-secondary border text-text-secondary px-3 py-1 rounded-lg text-sm">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {teams.length === 0 ? (
                  <p className="text-text-secondary text-sm text-center py-4">No teams yet</p>
                ) : (
                  teams.map(team => (
                    <div
                      key={team.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        activeTeam?.id === team.id ? 'bg-accent/20 border-2 border-accent' : 'bg-bg-primary border border-border hover:border-accent'
                      }`}
                      onClick={() => handleSelectTeam(team)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-text-primary font-medium">{team.name}</p>
                          <p className="text-xs text-text-secondary">{team.members.length}/{MAX_TEAM_SIZE}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                          className="p-1 hover:bg-red-500/20 text-red-500 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {activeTeam && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <button onClick={handleShareTeam} className="w-full flex items-center justify-center gap-2 bg-bg-primary border text-text-primary px-3 py-2 rounded-lg text-sm hover:border-accent">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button onClick={handleExportJSON} className="w-full flex items-center justify-center gap-2 bg-bg-primary border text-text-primary px-3 py-2 rounded-lg text-sm hover:border-accent">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button onClick={handleImportJSON} className="w-full flex items-center justify-center gap-2 bg-bg-primary border text-text-primary px-3 py-2 rounded-lg text-sm hover:border-accent">
                    <Upload className="w-4 h-4" /> Import
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {!activeTeam ? (
              <div className="bg-bg-secondary border border-border rounded-2xl p-12 text-center">
                <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-text-primary mb-2">No Team Selected</h2>
                <p className="text-text-secondary mb-6">Create or select a team to get started</p>
              </div>
            ) : (
              <>
                {/* Team Members */}
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">Team Members ({teamPokemon.length}/{MAX_TEAM_SIZE})</h2>
                  {teamPokemon.length === 0 ? (
                    <div className="bg-bg-secondary border border-border rounded-2xl p-12 text-center">
                      <p className="text-text-secondary">No Pokémon in this team yet</p>
                      <p className="text-sm text-text-secondary mt-2">Browse the PokéDex and click &quot;Add to Team&quot; on any Pokémon card</p>
                      <Link href="/" className="inline-block mt-4 bg-accent text-white px-6 py-2 rounded-full hover:bg-accent/90 transition-colors">
                        Browse PokéDex
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {teamPokemon.map(pokemon => (
                        <TeamMemberCard
                          key={pokemon.id}
                          pokemon={pokemon}
                          onRemove={handleRemovePokemon}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Analysis */}
                {teamPokemon.length > 0 && (
                  <TeamAnalysis team={teamPokemon} />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-text-secondary">Loading...</div></div>}>
      <TeamPageContent />
    </Suspense>
  );
}
