import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPokemon } from '@/lib/api/pokeapi';
import { getTopByBST, getBottomByBST, getMostCommonTypeCombos, calculateTypeDistribution } from '@/lib/utils/stats';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata = {
  title: 'Leaderboards - PokéDex',
  description: 'Rankings and statistics for all Pokémon',
};

export default async function LeaderboardsPage() {
  const allPokemon = await getAllPokemon();
  
  const topBST = getTopByBST(allPokemon, 20);
  const bottomBST = getBottomByBST(allPokemon, 20);
  const typeDistribution = calculateTypeDistribution(allPokemon);
  const typeCombos = getMostCommonTypeCombos(allPokemon, 15);

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
        <h1 className="text-4xl font-bold text-text-primary mb-8">📊 Leaderboards & Stats</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Top BST */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">🏆 Highest Base Stat Total</h2>
            <div className="space-y-2">
              {topBST.map((entry, index) => (
                <Link
                  key={entry.pokemonId}
                  href={`/pokemon/${entry.pokemonId}`}
                  className="flex items-center justify-between p-3 bg-bg-primary hover:bg-accent/10 border border-border hover:border-accent rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-accent w-8">#{index + 1}</span>
                    <span className="text-text-primary font-medium capitalize">{entry.name}</span>
                  </div>
                  <span className="text-accent font-bold">{entry.total}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom BST */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">📉 Lowest Base Stat Total</h2>
            <div className="space-y-2">
              {bottomBST.map((entry, index) => (
                <Link
                  key={entry.pokemonId}
                  href={`/pokemon/${entry.pokemonId}`}
                  className="flex items-center justify-between p-3 bg-bg-primary hover:bg-accent/10 border border-border hover:border-accent rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-text-secondary w-8">#{index + 1}</span>
                    <span className="text-text-primary font-medium capitalize">{entry.name}</span>
                  </div>
                  <span className="text-text-secondary font-bold">{entry.total}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">🎨 Type Distribution</h2>
            <div className="space-y-3">
              {typeDistribution.map(({ type, count, percentage }) => (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary capitalize font-medium">{type}</span>
                    <span className="text-text-secondary">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Combinations */}
          <div className="bg-bg-secondary border border-border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">⚡ Most Common Type Combos</h2>
            <div className="space-y-2">
              {typeCombos.map(({ combo, count }, index) => (
                <div
                  key={combo}
                  className="flex items-center justify-between p-3 bg-bg-primary border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent w-6">#{index + 1}</span>
                    <span className="text-text-primary font-medium capitalize">{combo.replace('/', ' / ')}</span>
                  </div>
                  <span className="text-accent font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
