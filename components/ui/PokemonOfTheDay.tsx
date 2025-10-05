'use client';

import { useState, useEffect } from 'react';
import { getPokemonOfTheDay, getTodayFormatted } from '@/lib/utils/pokemon-of-the-day';
import { getPokemon, getPokemonArtwork, formatPokemonName } from '@/lib/api/pokeapi';
import { Pokemon } from '@/lib/types/pokemon';
import { Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TypeBadge from '@/components/pokemon/TypeBadge';

export default function PokemonOfTheDay() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPokemonOfTheDay() {
      try {
        const pokemonId = getPokemonOfTheDay();
        const pokemonData = await getPokemon(pokemonId.toString());
        setPokemon(pokemonData);
      } catch (error) {
        console.error('Error loading Pokémon of the Day:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPokemonOfTheDay();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-3xl p-8 animate-pulse">
        <div className="h-8 bg-accent/20 rounded w-48 mb-4"></div>
        <div className="h-48 bg-accent/10 rounded"></div>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-3xl p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <Sparkles className="w-32 h-32 text-accent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-accent" />
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Pokémon of the Day
            </h2>
            <p className="text-sm text-text-secondary">{getTodayFormatted()}</p>
          </div>
        </div>

        {/* Pokemon Card */}
        <Link
          href={`/pokemon/${pokemon.id}`}
          className="block bg-bg-primary border border-border rounded-2xl p-6 hover:border-accent transition-all hover:scale-105"
        >
          <div className="flex items-center gap-6">
            {/* Image */}
            <div className="flex-shrink-0 relative w-32 h-32">
              <Image
                src={getPokemonArtwork(pokemon.id)}
                alt={pokemon.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-text-primary capitalize mb-2">
                {formatPokemonName(pokemon.name)}
              </h3>
              <p className="text-text-secondary mb-3">#{pokemon.id.toString().padStart(4, '0')}</p>
              
              {/* Types */}
              <div className="flex gap-2 mb-3">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type.slot} type={type.type.name} />
                ))}
              </div>

              {/* Stats preview */}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">HP: </span>
                  <span className="text-text-primary font-medium">
                    {pokemon.stats.find(s => s.stat.name === 'hp')?.base_stat}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">ATK: </span>
                  <span className="text-text-primary font-medium">
                    {pokemon.stats.find(s => s.stat.name === 'attack')?.base_stat}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">DEF: </span>
                  <span className="text-text-primary font-medium">
                    {pokemon.stats.find(s => s.stat.name === 'defense')?.base_stat}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Footer note */}
        <p className="text-xs text-text-secondary mt-4 text-center">
          ✨ A new Pokémon appears every day
        </p>
      </div>
    </div>
  );
}
