import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          Pokémon Not Found
        </h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          <p className="text-text-secondary mb-8">
            The Pokémon you&apos;re looking for doesn&apos;t exist in the Pokédex.
          </p>or was caught by another trainer.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-full transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to PokéDex
        </Link>
      </div>
    </div>
  );
}
