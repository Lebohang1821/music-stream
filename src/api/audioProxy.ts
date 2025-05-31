import axios from 'axios';

export async function proxyAudioFile(url: string): Promise<ArrayBuffer> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Range': 'bytes=0-',  // Request the whole file
        'Cache-Control': 'no-cache',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error proxying audio file:', error);
    throw new Error('Failed to load audio file');
  }
}

export function createObjectURL(buffer: ArrayBuffer, mimeType: string = 'audio/mpeg'): string {
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}
