'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Pokemon } from '@/lib/types/pokemon';
import { getPokemonArtwork, formatPokemonName } from '@/lib/api/pokeapi';
import TypeBadge from '@/components/pokemon/TypeBadge';

interface TeamMemberCardProps {
  pokemon: Pokemon;
  onRemove?: (pokemonId: number) => void;
  nickname?: string;
}

export default function TeamMemberCard({ pokemon, onRemove, nickname }: TeamMemberCardProps) {
  return (
    <div className="relative bg-bg-secondary border border-border rounded-2xl p-4 hover:border-accent transition-all group">
      {onRemove && (
        <button
          onClick={() => onRemove(pokemon.id)}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          aria-label="Remove from team"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <Link href={`/pokemon/${pokemon.id}`} className="block">
        <div className="relative w-full aspect-square mb-3">
          <Image
            src={getPokemonArtwork(pokemon.id)}
            alt={pokemon.name}
            fill
            className="object-contain"
          />
        </div>

        <h3 className="text-lg font-bold text-text-primary capitalize text-center mb-1">
          {nickname || formatPokemonName(pokemon.name)}
        </h3>
        <p className="text-xs text-text-secondary text-center mb-2">
          #{pokemon.id.toString().padStart(4, '0')}
        </p>

        <div className="flex gap-1 justify-center">
          {pokemon.types.map(type => (
            <TypeBadge key={type.slot} type={type.type.name} size="sm" />
          ))}
        </div>
      </Link>
    </div>
  );
}
