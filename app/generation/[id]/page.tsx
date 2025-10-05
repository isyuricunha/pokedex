import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPokemonList, getPokemon, extractPokemonId } from '@/lib/api/pokeapi';
import PokemonCard from '@/components/pokemon/PokemonCard';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface GenerationPageProps {
  params: Promise<{ id: string }>;
}

const GENERATIONS = [
  { id: 1, name: 'Generation I', region: 'Kanto', range: [1, 151], games: 'Red, Blue, Yellow', year: 1996 },
  { id: 2, name: 'Generation II', region: 'Johto', range: [152, 251], games: 'Gold, Silver, Crystal', year: 1999 },
  { id: 3, name: 'Generation III', region: 'Hoenn', range: [252, 386], games: 'Ruby, Sapphire, Emerald', year: 2002 },
  { id: 4, name: 'Generation IV', region: 'Sinnoh', range: [387, 493], games: 'Diamond, Pearl, Platinum', year: 2006 },
  { id: 5, name: 'Generation V', region: 'Unova', range: [494, 649], games: 'Black, White, Black 2, White 2', year: 2010 },
  { id: 6, name: 'Generation VI', region: 'Kalos', range: [650, 721], games: 'X, Y', year: 2013 },
  { id: 7, name: 'Generation VII', region: 'Alola', range: [722, 809], games: 'Sun, Moon, Ultra Sun, Ultra Moon', year: 2016 },
  { id: 8, name: 'Generation VIII', region: 'Galar', range: [810, 905], games: 'Sword, Shield', year: 2019 },
  { id: 9, name: 'Generation IX', region: 'Paldea', range: [906, 1025], games: 'Scarlet, Violet', year: 2022 },
];

export async function generateMetadata({ params }: GenerationPageProps) {
  const { id } = await params;
  const genId = parseInt(id);
  const generation = GENERATIONS.find(g => g.id === genId);

  if (!generation) {
    return { title: 'Generation not found' };
  }

  return {
    title: `${generation.name} - ${generation.region} - PokéDex`,
    description: `Explore all Pokémon from ${generation.name} (${generation.region} region)`,
  };
}

export default async function GenerationPage({ params }: GenerationPageProps) {
  const { id } = await params;
  const genId = parseInt(id);
  const generation = GENERATIONS.find(g => g.id === genId);

  if (!generation || genId < 1 || genId > 9) {
    notFound();
  }

  const [start, end] = generation.range;
  const totalPokemon = end - start + 1;

  try {
    // Load all Pokemon from this generation
    const listResponse = await getPokemonList(totalPokemon, start - 1);
    
    // Filter to only include main Pokemon (not alternate forms)
    const validResults = listResponse.results.filter((result) => {
      const pokemonId = extractPokemonId(result.url);
      return pokemonId >= start && pokemonId <= end;
    });

    const pokemonPromises = validResults.map((result) => {
      const pokemonId = extractPokemonId(result.url);
      return getPokemon(pokemonId.toString());
    });

    const pokemonList = await Promise.all(pokemonPromises);

    // Calculate stats
    const legendaryCount = 0; // Would need species data to determine
    const regionalVariants = 0; // Would need detailed analysis

    return (
      <div className="min-h-screen bg-bg-primary">
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Pokédex</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Generation Header */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/30 rounded-3xl p-8 mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              {generation.name}
            </h1>
            <p className="text-xl text-text-secondary mb-6">{generation.region} Region</p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-bg-primary border border-border rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Total Pokémon</p>
                <p className="text-2xl font-bold text-accent">{totalPokemon}</p>
              </div>
              <div className="bg-bg-primary border border-border rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Pokédex Range</p>
                <p className="text-2xl font-bold text-text-primary">#{start}-#{end}</p>
              </div>
              <div className="bg-bg-primary border border-border rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Games</p>
                <p className="text-sm font-medium text-text-primary">{generation.games}</p>
              </div>
              <div className="bg-bg-primary border border-border rounded-xl p-4">
                <p className="text-xs text-text-secondary mb-1">Release Year</p>
                <p className="text-2xl font-bold text-text-primary">{generation.year}</p>
              </div>
            </div>
          </div>

          {/* Generation Lore */}
          <div className="bg-bg-secondary border border-border rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">About {generation.region}</h2>
            <p className="text-text-primary leading-relaxed">
              {getGenerationDescription(genId)}
            </p>
          </div>

          {/* Pokemon Grid */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              All Pokémon from {generation.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Error loading generation:', error);
    notFound();
  }
}

function getGenerationDescription(genId: number): string {
  const descriptions: Record<number, string> = {
    1: "Kanto is where the Pokémon journey began. Home to the original 151 Pokémon, this region introduced trainers to iconic species like Pikachu, Charizard, and Mewtwo. The region features diverse environments from Viridian Forest to the Seafoam Islands.",
    2: "Johto expands the Pokémon world with 100 new species. This region introduced features like breeding, held items, and the day/night cycle. Notable Pokémon include the legendary beasts and the majestic Ho-Oh and Lugia.",
    3: "Hoenn brought 135 new Pokémon to the series, including powerful legendaries like Groudon, Kyogre, and Rayquaza. This tropical region introduced double battles and Pokémon Contests, emphasizing the bond between trainers and their Pokémon.",
    4: "Sinnoh introduced 107 new Pokémon and brought significant evolution to existing species. Home to the creation trio—Dialga, Palkia, and Giratina—this region explored the origins of the Pokémon universe itself.",
    5: "Unova marked a fresh start with 156 completely new Pokémon, the most of any generation. This region emphasized storytelling with the legendary dragons Reshiram, Zekrom, and Kyurem, exploring themes of truth and ideals.",
    6: "Kalos introduced 72 new Pokémon and brought the revolutionary Mega Evolution mechanic. This region, inspired by France, features the mysterious Xerneas, Yveltal, and Zygarde as its legendary trio.",
    7: "Alola brought 88 new Pokémon to a tropical paradise inspired by Hawaii. This region introduced Regional Variants (Alolan forms) and the powerful Ultra Beasts, along with the guardian deities of each island.",
    8: "Galar introduced 96 new Pokémon to a region inspired by Great Britain. This generation brought the Dynamax phenomenon and the Galarian forms of classic Pokémon, along with the legendary heroes Zacian and Zamazenta.",
    9: "Paldea is the newest region with 120 new Pokémon. Inspired by the Iberian Peninsula, this open-world region introduced the Terastal phenomenon and features the legendary Koraidon and Miraidon.",
  };

  return descriptions[genId] || "A region full of amazing Pokémon waiting to be discovered.";
}
