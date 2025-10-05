'use client';

import { Search, Clock, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSearchHistory, addToSearchHistory, removeFromSearchHistory } from '@/lib/utils/search-history';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search Pokémon by name or number...',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addToSearchHistory(query);
      setSearchHistory(getSearchHistory());
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onSearch(historyQuery);
    setShowSuggestions(false);
  };

  const handleRemoveHistory = (historyQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSearchHistory(historyQuery);
    setSearchHistory(getSearchHistory());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div ref={searchRef} className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full bg-bg-secondary border border-border rounded-full pl-12 pr-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </form>

      {/* Search History Dropdown */}
      {showSuggestions && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border rounded-2xl shadow-lg overflow-hidden z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-xs text-text-secondary font-medium">Recent Searches</p>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item.query)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-primary transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-text-secondary" />
                  <span className="text-text-primary">{item.query}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveHistory(item.query, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-bg-secondary rounded-full"
                  aria-label="Remove from history"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
