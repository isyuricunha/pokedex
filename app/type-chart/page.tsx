import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TypeChart from '@/components/ui/TypeChart';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata = {
  title: 'Type Chart - PokéDex',
  description: 'Interactive Pokémon type effectiveness chart',
};

export default function TypeChartPage() {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">⚡ Type Effectiveness Chart</h1>
          <p className="text-text-secondary">
            Learn which types are super effective, not very effective, or have no effect against other types.
          </p>
        </div>

        <TypeChart />
      </main>
    </div>
  );
}
