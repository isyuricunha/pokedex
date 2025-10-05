'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TOTAL_POKEMON = 1025;
const SHINY_CHANCE = 1 / 4096; // 1/4096 chance for shiny

export default function RandomPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate random Pokemon ID (1-1025)
    const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    
    // Check for shiny encounter (1/4096 chance)
    const isShiny = Math.random() < SHINY_CHANCE;
    
    // Store shiny state in sessionStorage for the details page to read
    if (isShiny) {
      sessionStorage.setItem('shinyEncounter', randomId.toString());
    }
    
    // Redirect to the random Pokemon's details page
    router.push(`/pokemon/${randomId}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-text-primary text-lg">Finding a random Pokémon...</p>
      </div>
    </div>
  );
}
