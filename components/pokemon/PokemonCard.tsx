import Image from 'next/image';
import Link from 'next/link';
import { Pokemon } from '@/lib/types/pokemon';
import { formatPokemonId, getPokemonArtwork } from '@/lib/api/pokeapi';
import TypeBadge from './TypeBadge';
import FavoriteButton from '@/components/ui/FavoriteButton';
import CompareButton from '@/components/ui/CompareButton';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const artworkUrl = getPokemonArtwork(pokemon.id);

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="group relative bg-bg-secondary border border-border rounded-2xl p-6 transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 cursor-pointer">
        {/* Pokemon Number */}
        <div className="absolute top-4 right-4 text-text-secondary font-mono text-sm">
          {formatPokemonId(pokemon.id)}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <FavoriteButton pokemonId={pokemon.id} size="sm" />
          <CompareButton pokemonId={pokemon.id} size="sm" />
        </div>

        {/* Pokemon Image */}
        <div className="relative w-full aspect-square mb-4 flex items-center justify-center">
          <Image
            src={artworkUrl}
            alt={pokemon.name}
            width={200}
            height={200}
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Pokemon Name */}
        <h3 className="text-xl font-bold text-text-primary mb-3 capitalize">
          {pokemon.name.replace('-', ' ')}
        </h3>

        {/* Pokemon Types */}
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.slot} type={type.type.name} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  );
}
