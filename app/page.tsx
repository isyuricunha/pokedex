import PokemonList from '@/components/pokemon/PokemonList';
import ThemeToggle from '@/components/ui/ThemeToggle';
import PokemonOfTheDay from '@/components/ui/PokemonOfTheDay';
import Link from 'next/link';
import { Sparkles, Users } from 'lucide-react';
import CompareBar from '@/components/ui/CompareBar';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-text-primary">
                Poké<span className="text-accent">Dex</span>
              </h1>
              <Link
                href="/random"
                className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                I&apos;m Feeling Lucky
              </Link>
              <Link
                href="/team"
                className="flex items-center gap-2 bg-bg-secondary border border-border hover:border-accent text-text-primary px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
              >
                <Users className="w-4 h-4" />
                My Teams
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pokémon of the Day */}
        <div className="mb-8">
          <PokemonOfTheDay />
        </div>

        {/* Main List */}
        <PokemonList />
      </main>

      {/* Compare Bar */}
      <CompareBar />

      {/* Footer */}
      <footer className="mt-16 border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-text-secondary text-sm">
            Built with ❤️ using{' '}
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              PokéAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
