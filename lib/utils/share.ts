// Share functionality utilities

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share using Web Share API (native mobile sharing)
 */
export async function shareViaWebShare(data: ShareData): Promise<boolean> {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    // User cancelled or error occurred
    if (error instanceof Error && error.name === 'AbortError') {
      // User cancelled - not an error
      return false;
    }
    console.error('Error sharing:', error);
    return false;
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } finally {
      document.body.removeChild(textArea);
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Generate shareable Pokemon URL
 */
export function getPokemonShareURL(pokemonId: number, pokemonName: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/pokemon/${pokemonId}`;
  }
  return `/pokemon/${pokemonId}`;
}

/**
 * Generate share data for a Pokemon
 */
export function getPokemonShareData(pokemonId: number, pokemonName: string): ShareData {
  return {
    title: `${pokemonName} - PokéDex`,
    text: `Check out ${pokemonName} on PokéDex!`,
    url: getPokemonShareURL(pokemonId, pokemonName),
  };
}

/**
 * Generate QR code data URL (using qrcode library)
 */
export async function generateQRCode(text: string): Promise<string> {
  // This would use a QR code library like 'qrcode'
  // For now, returning placeholder
  // Implementation: import QRCode from 'qrcode'
  // return await QRCode.toDataURL(text)
  return '';
}
