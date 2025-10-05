import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ChainLink } from '@/lib/types/pokemon';
import { formatPokemonName, getPokemonArtwork, extractPokemonId } from '@/lib/api/pokeapi';

interface EvolutionChainProps {
  chain: ChainLink;
}

export default function EvolutionChain({ chain }: EvolutionChainProps) {
  const renderEvolution = (link: ChainLink, depth: number = 0): JSX.Element[] => {
    const pokemonId = extractPokemonId(link.species.url);
    const elements: JSX.Element[] = [];

    elements.push(
      <div key={`${link.species.name}-${depth}`} className="flex flex-col items-center">
        <Link
          href={`/pokemon/${pokemonId}`}
          className="group relative bg-bg-secondary border border-border rounded-xl p-4 transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1"
        >
          <Image
            src={getPokemonArtwork(pokemonId)}
            alt={link.species.name}
            width={120}
            height={120}
            className="object-contain transition-transform group-hover:scale-110"
          />
          <p className="text-center text-sm font-medium text-text-primary mt-2 capitalize">
            {formatPokemonName(link.species.name)}
          </p>
        </Link>

        {link.evolution_details.length > 0 && link.evolution_details[0].min_level && (
          <p className="text-xs text-text-secondary mt-2">
            Lv. {link.evolution_details[0].min_level}
          </p>
        )}
      </div>
    );

    if (link.evolves_to.length > 0) {
      link.evolves_to.forEach((evolution, index) => {
        elements.push(
          <div key={`arrow-${depth}-${index}`} className="flex items-center justify-center px-2">
            <ChevronRight className="w-6 h-6 text-accent" />
          </div>
        );
        elements.push(...renderEvolution(evolution, depth + 1));
      });
    }

    return elements;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {renderEvolution(chain)}
    </div>
  );
}
