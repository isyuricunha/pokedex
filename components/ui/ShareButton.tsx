'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { isWebShareSupported, shareViaWebShare, copyToClipboard, getPokemonShareData } from '@/lib/utils/share';

interface ShareButtonProps {
  pokemonId: number;
  pokemonName: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ShareButton({ pokemonId, pokemonName, size = 'md' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWebShareSupported()) {
      const shareData = getPokemonShareData(pokemonId, pokemonName);
      await shareViaWebShare(shareData);
    } else {
      setShowMenu(!showMenu);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = getPokemonShareData(pokemonId, pokemonName);
    const success = await copyToClipboard(shareData.url);
    
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-bg-secondary border border-border text-text-secondary hover:border-accent hover:text-accent transition-all`}
        aria-label="Share Pokémon"
      >
        {copied ? (
          <Check className={`${iconSizes[size]} text-green-500`} />
        ) : (
          <Share2 className={`${iconSizes[size]}`} />
        )}
      </button>

      {/* Copy Menu (fallback for desktop) */}
      {showMenu && !isWebShareSupported() && (
        <div className="absolute top-full right-0 mt-2 bg-bg-secondary border border-border rounded-lg shadow-lg p-2 z-50 min-w-[150px]">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg-primary rounded transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
