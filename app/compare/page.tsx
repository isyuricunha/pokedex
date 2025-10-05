import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getPokemon, formatPokemonName, formatPokemonId, getPokemonArtwork } from '@/lib/api/pokeapi';
import TypeBadge from '@/components/pokemon/TypeBadge';
import { STAT_NAMES } from '@/lib/types/pokemon';

interface ComparePageProps {
  searchParams: Promise<{ pokemon?: string }>;
}

export async function generateMetadata() {
  return {
    title: 'Compare Pokémon - PokéDex',
    description: 'Compare two Pokémon side by side',
  };
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;
  const pokemonIds = params.pokemon?.split(',').map(id => parseInt(id));

  if (!pokemonIds || pokemonIds.length !== 2) {
    redirect('/');
  }

  try {
    const [pokemon1, pokemon2] = await Promise.all([
      getPokemon(pokemonIds[0]),
      getPokemon(pokemonIds[1]),
    ]);

    // Calculate stat comparison
    const getStatComparison = (stat1: number, stat2: number) => {
      const diff = stat1 - stat2;
      if (diff > 0) return { winner: 1, diff };
      if (diff < 0) return { winner: 2, diff: Math.abs(diff) };
      return { winner: 0, diff: 0 };
    };

    return (
      <div className="min-h-screen pb-16">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to PokéDex
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Pokémon Comparison
          </h1>

          {/* Comparison Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Pokemon 1 */}
            <div className="bg-bg-secondary border-2 border-blue-500/50 rounded-3xl p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-64 h-64">
                  <Image
                    src={getPokemonArtwork(pokemon1.id)}
                    alt={pokemon1.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-text-secondary font-mono text-sm mt-2">
                  {formatPokemonId(pokemon1.id)}
                </p>
                <h2 className="text-3xl font-bold text-text-primary capitalize">
                  {formatPokemonName(pokemon1.name)}
                </h2>
                <div className="flex gap-2 mt-3">
                  {pokemon1.types.map((type) => (
                    <TypeBadge key={type.slot} type={type.type.name} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Height</p>
                  <p className="text-lg font-bold text-text-primary">
                    {(pokemon1.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Weight</p>
                  <p className="text-lg font-bold text-text-primary">
                    {(pokemon1.weight / 10).toFixed(1)} kg
                  </p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Total Stats</p>
                  <p className="text-lg font-bold text-blue-500">
                    {pokemon1.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Pokemon 2 */}
            <div className="bg-bg-secondary border-2 border-red-500/50 rounded-3xl p-8">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-64 h-64">
                  <Image
                    src={getPokemonArtwork(pokemon2.id)}
                    alt={pokemon2.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-text-secondary font-mono text-sm mt-2">
                  {formatPokemonId(pokemon2.id)}
                </p>
                <h2 className="text-3xl font-bold text-text-primary capitalize">
                  {formatPokemonName(pokemon2.name)}
                </h2>
                <div className="flex gap-2 mt-3">
                  {pokemon2.types.map((type) => (
                    <TypeBadge key={type.slot} type={type.type.name} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Height</p>
                  <p className="text-lg font-bold text-text-primary">
                    {(pokemon2.height / 10).toFixed(1)} m
                  </p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Weight</p>
                  <p className="text-lg font-bold text-text-primary">
                    {(pokemon2.weight / 10).toFixed(1)} kg
                  </p>
                </div>
                <div className="bg-bg-primary border border-border rounded-xl p-4">
                  <p className="text-xs text-text-secondary mb-1">Total Stats</p>
                  <p className="text-lg font-bold text-red-500">
                    {pokemon2.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Comparison */}
          <div className="mt-8 bg-bg-secondary border border-border rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
              Base Stats Comparison
            </h3>
            <div className="space-y-6">
              {pokemon1.stats.map((stat1, index) => {
                const stat2 = pokemon2.stats[index];
                const comparison = getStatComparison(stat1.base_stat, stat2.base_stat);
                const maxStat = Math.max(stat1.base_stat, stat2.base_stat, 100);

                return (
                  <div key={stat1.stat.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-secondary w-24">
                        {STAT_NAMES[stat1.stat.name]}
                      </span>
                      <div className="flex-1 mx-4 flex items-center gap-4">
                        <div className="flex-1 flex items-center justify-end">
                          <span className={`text-sm font-bold mr-2 ${comparison.winner === 1 ? 'text-blue-500' : 'text-text-primary'}`}>
                            {stat1.base_stat}
                          </span>
                          <div className="w-full max-w-xs h-3 bg-bg-primary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${(stat1.base_stat / maxStat) * 100}%` }}
                            />
                          </div>
                        </div>
                        <ArrowRight className={`w-5 h-5 flex-shrink-0 ${comparison.winner === 0 ? 'text-text-secondary' : 'text-accent'}`} />
                        <div className="flex-1 flex items-center">
                          <div className="w-full max-w-xs h-3 bg-bg-primary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 transition-all"
                              style={{ width: `${(stat2.base_stat / maxStat) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ml-2 ${comparison.winner === 2 ? 'text-red-500' : 'text-text-primary'}`}>
                            {stat2.base_stat}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Abilities Comparison */}
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="bg-bg-secondary border border-border rounded-3xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                {formatPokemonName(pokemon1.name)} Abilities
              </h3>
              <div className="space-y-2">
                {pokemon1.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-bg-primary border border-border rounded-lg p-3"
                  >
                    <p className="text-text-primary font-medium capitalize">
                      {ability.ability.name.replace('-', ' ')}
                    </p>
                    {ability.is_hidden && (
                      <span className="text-xs text-blue-500">(Hidden)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary border border-border rounded-3xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                {formatPokemonName(pokemon2.name)} Abilities
              </h3>
              <div className="space-y-2">
                {pokemon2.abilities.map((ability) => (
                  <div
                    key={ability.ability.name}
                    className="bg-bg-primary border border-border rounded-lg p-3"
                  >
                    <p className="text-text-primary font-medium capitalize">
                      {ability.ability.name.replace('-', ' ')}
                    </p>
                    {ability.is_hidden && (
                      <span className="text-xs text-red-500">(Hidden)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading Pokemon for comparison:', error);
    notFound();
  }
}
