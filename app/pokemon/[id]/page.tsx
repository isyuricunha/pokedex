import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Ruler, Weight, Sparkles } from 'lucide-react';
import {
  getPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  formatPokemonName,
  formatPokemonId,
  getPokemonArtwork,
} from '@/lib/api/pokeapi';
import TypeBadge from '@/components/pokemon/TypeBadge';
import StatBar from '@/components/pokemon/StatBar';
import EvolutionChain from '@/components/pokemon/EvolutionChain';
import TypeMatchup from '@/components/pokemon/TypeMatchup';
import BreedingInfo from '@/components/pokemon/BreedingInfo';
import DamageCalculator from '@/components/pokemon/DamageCalculator';
import MoveList from '@/components/pokemon/MoveList';
import PokedexEntries from '@/components/pokemon/PokedexEntries';
import FavoriteButton from '@/components/ui/FavoriteButton';
import CompareButton from '@/components/ui/CompareButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PokemonPageProps) {
  const { id } = await params;
  
  try {
    const pokemon = await getPokemon(id);
    return {
      title: `${formatPokemonName(pokemon.name)} - PokéDex`,
      description: `Informações detalhadas sobre ${formatPokemonName(pokemon.name)}`,
    };
  } catch {
    return {
      title: 'Pokémon não encontrado - PokéDex',
    };
  }
}

// Import the client component
import ShinyPokemonWrapper from '@/components/pokemon/ShinyPokemonWrapper';

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;

  try {
    const pokemon = await getPokemon(id);
    const species = await getPokemonSpecies(id);

    // Extract evolution chain ID from URL (may not exist for some Pokemon)
    let evolutionData = null;
    try {
      if (species.evolution_chain?.url) {
        const evolutionChainId = parseInt(
          species.evolution_chain.url.split('/').slice(-2, -1)[0]
        );
        evolutionData = await getEvolutionChain(evolutionChainId);
      }
    } catch {
      console.log('Evolution chain not available for this Pokemon');
      // evolutionData remains null, page will skip evolution section
    }

    // Get English flavor text
    const flavorText = species.flavor_text_entries
      .find((entry) => entry.language.name === 'en')
      ?.flavor_text.replace(/\f/g, ' ');

    return (
      <ShinyPokemonWrapper pokemonId={pokemon.id}>
        <div className="min-h-screen pb-16">
        {/* Header */}
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
          {/* Pokemon Header */}
          <div className="bg-bg-secondary border border-border rounded-3xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Image */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md aspect-square">
                  <Image
                    src={getPokemonArtwork(pokemon.id)}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                {species.is_legendary && (
                  <div className="mt-4 flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Legendary</span>
                  </div>
                )}
                {species.is_mythical && (
                  <div className="mt-4 flex items-center gap-2 bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">Mythical</span>
                  </div>
                )}
              </div>

              {/* Right: Info */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <p className="text-text-secondary font-mono text-lg">
                    {formatPokemonId(pokemon.id)}
                  </p>
                  <FavoriteButton pokemonId={pokemon.id} size="md" />
                  <CompareButton pokemonId={pokemon.id} size="md" />
                </div>
                <h1 className="text-5xl font-bold text-text-primary mb-4 capitalize">
                  {formatPokemonName(pokemon.name)}
                </h1>

                {/* Types */}
                <div className="flex gap-2 mb-6">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type.slot} type={type.type.name} size="lg" />
                  ))}
                </div>

                {/* Flavor Text */}
                {flavorText && (
                  <p className="text-text-secondary text-lg leading-relaxed mb-6">
                    {flavorText}
                  </p>
                )}

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-bg-primary border border-border rounded-xl p-4">
                    <Ruler className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-xs text-text-secondary">Height</p>
                      <p className="text-lg font-bold text-text-primary">
                        {(pokemon.height / 10).toFixed(1)} m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-bg-primary border border-border rounded-xl p-4">
                    <Weight className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-xs text-text-secondary">Weight</p>
                      <p className="text-lg font-bold text-text-primary">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-bg-secondary border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Base Stats
            </h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <StatBar
                  key={stat.stat.name}
                  stat={stat.stat.name}
                  value={stat.base_stat}
                />
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary font-medium">Total</span>
                <span className="text-2xl font-bold text-accent">
                  {pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Type Matchup */}
          <TypeMatchup types={pokemon.types.map((t) => t.type.name)} />

          {/* Abilities */}
          <div className="bg-bg-secondary border border-border rounded-3xl p-8 mb-8 mt-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Abilities</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability.ability.name}
                  className="bg-bg-primary border border-border rounded-xl p-4"
                >
                  <p className="text-text-primary font-medium capitalize">
                    {ability.ability.name.replace('-', ' ')}
                  </p>
                  {ability.is_hidden && (
                    <span className="text-xs text-accent mt-1 block">
                      (Hidden Ability)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Chain */}
          {evolutionData && evolutionData.chain.evolves_to.length > 0 && (
            <div className="bg-bg-secondary border border-border rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Evolution Chain
              </h2>
              <EvolutionChain chain={evolutionData.chain} />
            </div>
          )}

          {/* Breeding Information */}
          <BreedingInfo species={species} />

          {/* Damage Calculator */}
          <div className="mt-8">
            <DamageCalculator attacker={pokemon} />
          </div>

          {/* Pokédex Entries */}
          <div className="mt-8">
            <PokedexEntries species={species} />
          </div>

          {/* Moves */}
          <div className="mt-8">
            <MoveList moves={pokemon.moves} />
          </div>
        </main>
        </div>
      </ShinyPokemonWrapper>
    );
  } catch (error) {
    console.error('Error loading Pokemon:', error);
    notFound();
  }
}
