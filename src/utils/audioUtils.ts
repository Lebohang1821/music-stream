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
 * Helper functions for properly handling audio files
 */

/**
 * Creates a properly encoded URL for audio files
 */
export function createSafeAudioUrl(path: string): string {
  if (!path || typeof path !== 'string') {
    console.error('Invalid audio path:', path);
    return '';
  }

  try {
    // First, decode the path to handle any already encoded characters
    // This prevents double-encoding issues
    let decodedPath = path;
    try {
      decodedPath = decodeURIComponent(path);
    } catch (e) {
      // If decoding fails, use the original path
      decodedPath = path;
    }

    // Clean the path from leading slash
    const cleanPath = decodedPath.startsWith('/') 
      ? decodedPath.substring(1) 
      : decodedPath;

    // For local development
    if (window.location.hostname === 'localhost') {
      // Encode individual path segments but preserve slashes
      const segments = cleanPath.split('/');
      const encodedSegments = segments.map(segment => encodeURIComponent(segment));
      return '/' + encodedSegments.join('/');
    }

    // For production environment
    // Encode the entire path without breaking it at slashes
    // This helps with files that have spaces or special characters
    return `${window.location.origin}/${encodeURIComponent(cleanPath)}`;
  } catch (error) {
    console.error('Error creating audio URL:', error);
    return '';
  }
}

/**
 * Tests if an audio file exists and can be loaded
 */
export async function testAudioFile(url: string): Promise<boolean> {
  try {
    // First make a HEAD request to verify the file exists
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-cache',
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      console.error('Audio file not found:', url);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking audio file:', error);
    return false;
  }
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
