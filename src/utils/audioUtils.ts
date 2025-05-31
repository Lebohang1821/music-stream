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

/**
 * Creates a properly formatted URL for audio files
 */
export function createReliableAudioUrl(path: string): string {
  if (!path || typeof path !== 'string') {
    console.error('Invalid audio path:', path);
    return '';
  }

  // If it's already a full URL, just return it
  if (path.startsWith('http')) {
    return path;
  }

  // Remove leading slash if present for consistency
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Handle spaces in filenames correctly
  const encodedPath = encodeURI(cleanPath);
  
  // For development environment
  if (window.location.hostname === 'localhost') {
    return `/${encodedPath}`;
  }
  
  // For production environment (Vercel)
  return `${window.location.origin}/${encodedPath}`;
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

/**
 * Formats time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
