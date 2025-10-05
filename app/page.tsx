import PokemonList from '@/components/pokemon/PokemonList';
import ThemeToggle from '@/components/ui/ThemeToggle';
import CompareBar from '@/components/ui/CompareBar';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-text-primary">
                Poké<span className="text-accent">Dex</span>
              </h1>
              <p className="text-text-secondary mt-1">
                Explore the world of Pokémon
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
