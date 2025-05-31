/**
 * Normalizes audio file paths for consistent access across environments
 */
export function normalizeAudioPath(path: string): string {
  // If already a blob URL or full URL, return as is
  if (path.startsWith('blob:') || path.startsWith('http')) {
    return path;
  }
  
  // Clean up path
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // For development, use a simple relative path
  if (window.location.hostname === 'localhost') {
    return `/${cleanPath}`;
  } 
  
  // For production on Vercel
  return `${window.location.origin}/${cleanPath}`;
}

/**
 * Creates a URL that works across environments
 */
export function createAudioUrl(path: string): string {
  const normalizedPath = normalizeAudioPath(path);
  
  // Add a cache-busting parameter
  const url = new URL(normalizedPath, window.location.origin);
  url.searchParams.append('_', Date.now().toString());
  
  return url.toString();
}

/**
 * Simple fetch-based audio proxy function
 * This avoids the axios dependency
 */
export async function proxyAudioFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url, {
    headers: {
      'Range': 'bytes=0-',
      'Cache-Control': 'no-cache',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to load audio file: ${response.status} ${response.statusText}`);
  }
  
  return await response.arrayBuffer();
}

/**
 * Creates a blob URL from an array buffer
 */
export function createObjectURL(buffer: ArrayBuffer, mimeType: string = 'audio/mpeg'): string {
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Helper functions for handling audio playback
 */

// Maximum number of fetch retries
const MAX_RETRIES = 2;

/**
 * Preloads an audio file for better playback
 */
export async function preloadAudio(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = 'auto';
    
    // Set a timeout for preloading
    const timeout = setTimeout(() => {
      audio.src = '';
      resolve(false);
    }, 3000);
    
    audio.oncanplaythrough = () => {
      clearTimeout(timeout);
      audio.src = '';
      resolve(true);
    };
    
    audio.onerror = () => {
      clearTimeout(timeout);
      audio.src = '';
      resolve(false);
    };
    
    audio.src = url;
    audio.load();
  });
}

/**
 * Creates a more reliable URL for audio files
 */
export function createReliableAudioUrl(path: string): string {
  // Handle relative paths
  if (!path.startsWith('http')) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // For development environment
    if (window.location.hostname === 'localhost') {
      return `/${cleanPath}`;
    }
    
    // For production environment
    return `${window.location.origin}/${cleanPath}`;
  }
  
  return path;
}

/**
 * Checks if an audio file exists and is accessible
 */
export async function checkAudioExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store'
    });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio:', error);
    return false;
  }
}
