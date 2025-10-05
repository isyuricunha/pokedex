'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/lib/types/pokemon';
import { getPokemonList, getPokemon, extractPokemonId } from '@/lib/api/pokeapi';
import PokemonCard from './PokemonCard';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import LoadingCard from '@/components/ui/LoadingCard';
import FilterPanel, { FilterState, GENERATIONS } from '@/components/ui/FilterPanel';
import { getFavorites } from '@/lib/utils/favorites';

const POKEMON_PER_PAGE = 20;
const TOTAL_POKEMON = 1025; // Total main Pokemon (Gen I-IX). IDs 10001+ are alternate forms without species data

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]); // Store all Pokemon for filtering
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({ types: [], generation: null, favoritesOnly: false, minSpeed: undefined, minAttack: undefined, minHP: undefined, ability: undefined, eggGroup: undefined, evolutionStage: undefined });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const totalPages = Math.ceil(TOTAL_POKEMON / POKEMON_PER_PAGE);

  // Check if filters are active
  useEffect(() => {
    const active = searchQuery.trim() !== '' || filters.types.length > 0 || filters.generation !== null || filters.favoritesOnly || (filters.minSpeed && filters.minSpeed > 0) || (filters.minAttack && filters.minAttack > 0) || (filters.minHP && filters.minHP > 0) || !!filters.ability || !!filters.eggGroup || !!filters.evolutionStage;
    setHasActiveFilters(active);
  }, [searchQuery, filters]);

  // Load Pokemon based on filters
  useEffect(() => {
    if (hasActiveFilters) {
      loadAllPokemonForFiltering();
    } else {
      loadPokemon(currentPage);
    }
  }, [currentPage, hasActiveFilters]);

  useEffect(() => {
    let filtered = hasActiveFilters ? [...allPokemon] : [...pokemon];

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      );
    }

    // Apply type filter
    if (filters.types.length > 0) {
      filtered = filtered.filter((p) =>
        p.types.some((t) => filters.types.includes(t.type.name))
      );
    }

    // Apply generation filter
    if (filters.generation) {
      const gen = GENERATIONS.find((g) => g.id === filters.generation);
      if (gen) {
        filtered = filtered.filter(
          (p) => p.id >= gen.range[0] && p.id <= gen.range[1]
        );
      }
    }

    // Apply favorites filter
    if (filters.favoritesOnly) {
      const favorites = getFavorites();
      filtered = filtered.filter((p) => favorites.includes(p.id));
    }

    // Apply stat filters
    if (filters.minSpeed && filters.minSpeed > 0) {
      filtered = filtered.filter((p) => {
        const speed = p.stats.find((s: { stat: { name: string }; base_stat: number }) => s.stat.name === 'speed')?.base_stat || 0;
        return speed >= (filters.minSpeed || 0);
      });
    }

    if (filters.minAttack && filters.minAttack > 0) {
      filtered = filtered.filter((p) => {
        const attack = p.stats.find((s: { stat: { name: string }; base_stat: number }) => s.stat.name === 'attack')?.base_stat || 0;
        return attack >= (filters.minAttack || 0);
      });
    }

    if (filters.minHP && filters.minHP > 0) {
      filtered = filtered.filter((p) => {
        const hp = p.stats.find((s: { stat: { name: string }; base_stat: number }) => s.stat.name === 'hp')?.base_stat || 0;
        return hp >= (filters.minHP || 0);
      });
    }

    // Apply ability filter
    if (filters.ability && filters.ability.trim() !== '') {
      const abilitySearch = filters.ability.toLowerCase();
      filtered = filtered.filter((p) => 
        p.abilities.some((a: { ability: { name: string } }) => 
          a.ability.name.toLowerCase().includes(abilitySearch)
        )
      );
    }

    // Note: egg group and evolution stage filters require species data
    // These will be applied server-side or require loading species data for all Pokemon
    // For now, showing a note that these filters work best with smaller datasets

    setFilteredPokemon(filtered);
  }, [searchQuery, pokemon, allPokemon, filters, hasActiveFilters]);

  const loadPokemon = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * POKEMON_PER_PAGE;
      const listResponse = await getPokemonList(POKEMON_PER_PAGE, offset);

      // Filter out alternate forms (IDs > 1025) to avoid species 404 errors
      const validResults = listResponse.results.filter((result) => {
        const id = extractPokemonId(result.url);
        return id <= TOTAL_POKEMON; // Only include main Pokemon (1-1025)
      });

      const pokemonPromises = validResults.map((result) => {
        const id = extractPokemonId(result.url);
        return getPokemon(id);
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllPokemonForFiltering = async () => {
    // If we already have all Pokemon loaded, don't reload
    if (allPokemon.length === TOTAL_POKEMON) {
      return;
    }

    setLoading(true);
    try {
      // Determine range based on generation filter
      let start = 1;
      let end = TOTAL_POKEMON;

      if (filters.generation) {
        const gen = GENERATIONS.find((g) => g.id === filters.generation);
        if (gen) {
          start = gen.range[0];
          end = gen.range[1];
        }
      }

      const count = end - start + 1;
      const listResponse = await getPokemonList(count, start - 1);

      // Filter out alternate forms (IDs > 1025) to avoid species 404 errors
      const validResults = listResponse.results.filter((result) => {
        const id = extractPokemonId(result.url);
        return id >= start && id <= end && id <= TOTAL_POKEMON;
      });

      const pokemonPromises = validResults.map((result) => {
        const id = extractPokemonId(result.url);
        return getPokemon(id);
      });

      const pokemonData = await Promise.all(pokemonPromises);
      setAllPokemon(pokemonData);
    } catch (error) {
      console.error('Error loading all Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Clear allPokemon if no filters are active
    const willHaveActiveFilters = newFilters.types.length > 0 || newFilters.generation !== null || newFilters.favoritesOnly;
    if (!willHaveActiveFilters && searchQuery.trim() === '') {
      setAllPokemon([]);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <FilterPanel onFilterChange={handleFilterChange} />
      </div>

      {/* Pokemon Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: POKEMON_PER_PAGE }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      ) : filteredPokemon.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>

          {/* Pagination - only show if not searching or filtering */}
          {!hasActiveFilters && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">
            No Pokémon found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
