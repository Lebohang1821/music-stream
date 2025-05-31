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
