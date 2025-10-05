'use client';

import { useEffect, useState } from 'react';

interface ShinyPokemonWrapperProps {
  pokemonId: number;
  children: React.ReactNode;
}

export default function ShinyPokemonWrapper({ pokemonId, children }: ShinyPokemonWrapperProps) {
  const [isShiny, setIsShiny] = useState(false);

  useEffect(() => {
    // Check if this is a shiny encounter from /random
    const shinyId = sessionStorage.getItem('shinyEncounter');
    if (shinyId === pokemonId.toString()) {
      setIsShiny(true);
      sessionStorage.removeItem('shinyEncounter');
      
      // Show notification for 10 seconds
      const timer = setTimeout(() => setIsShiny(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [pokemonId]);

  return (
    <>
      {/* Shiny Notification */}
      {isShiny && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-500 text-black px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <p className="font-bold flex items-center gap-2">
            ✨ Shiny Pokémon! ✨
          </p>
        </div>
      )}
      {children}
    </>
  );
}
