import { createReliableAudioUrl, checkAudioExists } from '@/utils/audioUtils';

class AudioService implements IAudioService {
  private audio: HTMLAudioElement | null = null;
  private currentSong: any = null;
  private queue: any[] = [];
  private originalQueue: any[] = [];
  private currentIndex: number = -1;
  private isShuffleMode: boolean = false;
  private isRepeatMode: boolean = false;
  private isLoadingState: boolean = false;
  private bufferingTimeout: number | null = null;
  private progressivePlaybackStarted: boolean = false;

  initialize(): IAudioService {
    if (!this.audio) {
      this.audio = new Audio();
      
      // Set preload to auto to start buffering immediately
      this.audio.preload = 'auto';
      
      // Allow crossorigin content for better streaming
      this.audio.crossOrigin = 'anonymous';
      
      // Add retry mechanism
      this.maxRetries = 3;
      
      this.setupAudioEvents();
    }
    return this;
  }

  private setupAudioEvents() {
    if (!this.audio) return;
    
    // Track loading states
    this.audio.addEventListener('loadstart', () => {
      this.isLoadingState = true;
      this.progressivePlaybackStarted = false;
      
      if (this.onLoadingChange) {
        this.onLoadingChange(true);
      }
    });
    
    // Start playing as soon as we have enough data
    this.audio.addEventListener('canplaythrough', () => {
      if (this.isLoadingState && !this.progressivePlaybackStarted) {
        this.progressivePlaybackStarted = true;
        this.isLoadingState = false;
        
        if (this.onLoadingChange) {
          this.onLoadingChange(false);
        }
        
        // Start playing if we're supposed to
        if (this.shouldBePlayingWhenReady) {
          this.audio?.play().catch(err => {
            console.error('Error in progressive playback:', err);
          });
        }
      }
    });
    
    // Monitor buffering events
    this.audio.addEventListener('progress', () => {
      this.checkBufferingProgress();
    });
    
    // Start playback when a minimum amount is buffered
    this.audio.addEventListener('canplay', () => {
      // We have at least some data, enough to start playing
      if (this.isLoadingState && !this.progressivePlaybackStarted) {
        // Start a timer to allow a bit more buffering before playing
        if (this.bufferingTimeout === null) {
          this.bufferingTimeout = window.setTimeout(() => {
            if (!this.progressivePlaybackStarted) {
              this.progressivePlaybackStarted = true;
              this.isLoadingState = false;
              
              if (this.onLoadingChange) {
                this.onLoadingChange(false);
              }
              
              if (this.shouldBePlayingWhenReady && this.audio) {
                this.audio.play().catch(err => {
                  console.error('Error in delayed playback:', err);
                });
              }
            }
            this.bufferingTimeout = null;
          }, 500); // Short delay to allow more buffering
        }
      }
    });
    
    // Handle playback issues
    this.audio.addEventListener('waiting', () => {
      // We're waiting for more data
      if (!this.isLoadingState) {
        this.isLoadingState = true;
        if (this.onBuffering) {
          this.onBuffering(true);
        }
      }
    });
    
    this.audio.addEventListener('playing', () => {
      // Playback has started or resumed
      this.isLoadingState = false;
      if (this.onBuffering) {
        this.onBuffering(false);
      }
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
    });
    
    this.audio.addEventListener('error', (e) => {
      this.isLoadingState = false;
      this.progressivePlaybackStarted = false;
      if (this.bufferingTimeout !== null) {
        clearTimeout(this.bufferingTimeout);
        this.bufferingTimeout = null;
      }
      
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
      if (this.onError) {
        this.onError(this.audio?.error?.message || 'Error loading audio');
      }
      console.error('Audio error:', this.audio?.error);
    });
    
    // Clean up timeout on end
    this.audio.addEventListener('ended', () => {
      if (this.bufferingTimeout !== null) {
        clearTimeout(this.bufferingTimeout);
        this.bufferingTimeout = null;
      }
      this.playNext();
      if (this.onSongChange) {
        this.onSongChange(this.currentSong);
      }
    });
    
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.audio?.currentTime || 0, this.audio?.duration || 0);
      }
    });
  }

  // Flag to track if we should start playing when ready
  private shouldBePlayingWhenReady: boolean = false;
  
  // Check if we have enough buffered data
  private checkBufferingProgress() {
    if (!this.audio || !this.isLoadingState || this.progressivePlaybackStarted) return;
    
    if (this.audio.buffered.length > 0) {
      // Calculate how many seconds we've buffered
      const bufferedEnd = this.audio.buffered.end(0);
      const duration = this.audio.duration;
      
      // If we have at least 10 seconds or 15% buffered, start playing
      if (bufferedEnd >= 10 || (duration && bufferedEnd / duration >= 0.15)) {
        this.progressivePlaybackStarted = true;
        this.isLoadingState = false;
        
        if (this.onLoadingChange) {
          this.onLoadingChange(false);
        }
        
        if (this.shouldBePlayingWhenReady) {
          this.audio.play().catch(err => {
            console.error('Error in buffering-based playback:', err);
          });
        }
      }
    }
  }

  onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  onSongChange: ((song: any) => void) | null = null;
  onLoadingChange: ((isLoading: boolean) => void) | null = null;
  onError: ((message: string) => void) | null = null;
  onBuffering: ((isBuffering: boolean) => void) | null = null;

  setQueue(songs: any[]) {
    this.queue = [...songs];
  }

  // Load a song without playing it
  loadSong(song: any) {
    if (!this.audio) return;
    
    // Find the song in the queue or add it
    const songIndex = this.queue.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      this.currentIndex = songIndex;
    } else {
      // If song isn't in the queue, add it
      this.queue.unshift(song);
      this.currentIndex = 0;
    }
    
    // Load the song but don't play
    this.currentSong = song;
    this.audio.src = song.audioUrl;
    this.audio.load();
  }

  // Add a retry mechanism for loading audio
  private maxRetries = 3;
  private retryCount = 0;
  private lastAttemptedSong: any = null;

  // Add a method to handle fetch aborts by validating the audio file first
  private async validateAudioAndPlay(song: any): Promise<boolean> {
    // Stop all previous loads
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }
    
    // Create a reliable URL
    const audioUrl = createReliableAudioUrl(song.audioUrl);
    
    try {
      // Create a clean URL for checking
      const url = new URL(audioUrl, window.location.origin);
      
      // Check if the audio file exists
      const exists = await checkAudioExists(url.toString());
      if (!exists) {
        console.error(`Audio file does not exist or is not accessible: ${url.toString()}`);
        return false;
      }
      
      // File exists, now try to load it
      this.audio!.src = url.toString();
      this.audio!.load();
      
      // Return success
      return true;
    } catch (error) {
      console.error('Error validating audio:', error);
      return false;
    }
  }
  
  async play(song: any) {
    if (!this.audio) return;
    
    // Reset retry count when loading a new song
    if (!this.lastAttemptedSong || this.lastAttemptedSong.id !== song.id) {
      this.retryCount = 0;
      this.lastAttemptedSong = song;
    }
    
    // Cancel any previous timeouts
    if (this.bufferingTimeout !== null) {
      clearTimeout(this.bufferingTimeout);
      this.bufferingTimeout = null;
    }
    
    // If it's the same song, just toggle play/pause
    if (this.currentSong && this.currentSong.id === song.id) {
      if (this.audio.paused) {
        this.shouldBePlayingWhenReady = true;
        try {
          await this.audio.play();
        } catch (err) {
          console.error('Error playing existing audio:', err);
          this.shouldBePlayingWhenReady = false;
          this.handlePlayError(err, song);
        }
      } else {
        this.shouldBePlayingWhenReady = false;
        this.audio.pause();
      }
      return;
    }
    
    // Find the song index in the queue
    const songIndex = this.queue.findIndex(s => s.id === song.id);
    if (songIndex !== -1) {
      this.currentIndex = songIndex;
    } else {
      // If song isn't in the queue, add it
      this.queue.unshift(song);
      this.currentIndex = 0;
    }
    
    // Set loading state
    this.isLoadingState = true;
    this.progressivePlaybackStarted = false;
    this.shouldBePlayingWhenReady = true;
    
    if (this.onLoadingChange) {
      this.onLoadingChange(true);
    }
    
    // Load and prepare to play the new song
    this.currentSong = song;
    
    // Validate and load the audio file with a smaller chunk approach
    try {
      const isValid = await this.validateAudioAndPlay(song);
      
      if (!isValid) {
        this.handlePlayError(new Error("Audio validation failed"), song);
        return;
      }
      
      // Wait a small amount of time to allow initial buffering
      setTimeout(() => {
        if (this.shouldBePlayingWhenReady) {
          this.audio!.play().catch((err) => {
            console.error('Error in initial playback:', err);
            this.handlePlayError(err, song);
          });
        }
      }, 200);
      
    } catch (err) {
      console.error('Error setting audio source:', err);
      this.handlePlayError(err, song);
    }
  }
  
  // Handle play errors with retry mechanism
  private handlePlayError(error: any, song: any) {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying playback (${this.retryCount}/${this.maxRetries})...`);
      
      // Short delay before retry
      setTimeout(() => {
        // Try with a modified URL to bypass cache
        this.play(song);
      }, 1000);
    } else {
      this.isLoadingState = false;
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
      if (this.onError) {
        this.onError(`Failed to play audio after ${this.maxRetries} attempts. Please try again later.`);
      }
    }
  }

  // Override default playNext to include error handling
  playNext() {
    if (this.queue.length === 0) return;
    
    if (this.isRepeatMode && this.currentSong) {
      // In repeat mode, just restart the current song
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(err => {
          console.error('Error in repeat mode:', err);
          this.handlePlayError(err, this.currentSong);
        });
      }
      return;
    }
    
    // Move to next track
    this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    const nextSong = this.queue[this.currentIndex];
    
    if (nextSong) {
      // Reset retry count for new song
      this.retryCount = 0;
      this.lastAttemptedSong = nextSong;
      
      this.currentSong = nextSong;
      if (this.audio) {
        // Make the URL absolute and add cache-busting
        const baseUrl = window.location.origin;
        let audioUrl: string;
        
        if (nextSong.audioUrl.startsWith('http')) {
          audioUrl = nextSong.audioUrl;
        } else {
          if (window.location.hostname === 'localhost') {
            audioUrl = nextSong.audioUrl;
          } else {
            const cleanPath = nextSong.audioUrl.startsWith('/') ? nextSong.audioUrl.substring(1) : nextSong.audioUrl;
            audioUrl = `${baseUrl}/${cleanPath}`;
          }
        }
        
        const urlWithCache = new URL(audioUrl, baseUrl);
        urlWithCache.searchParams.append('_', Date.now().toString());
        
        this.audio.src = urlWithCache.toString();
        this.audio.load();
        this.audio.play().catch(err => {
          console.error('Error playing next song:', err);
          this.handlePlayError(err, nextSong);
        });
        
        if (this.onSongChange) {
          this.onSongChange(nextSong);
        }
      }
    }
  }

  // Make sure playPrevious method is correctly defined
  playPrevious() {
    if (this.queue.length === 0) return;
    
    // If we're at the start or within first 3 seconds, go to previous song
    if (this.currentIndex > 0 && this.audio && this.audio.currentTime > 3) {
      // If we're past 3 seconds into the song, restart the current song
      this.audio.currentTime = 0;
      return;
    }
    
    // Move to previous track
    this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length;
    const prevSong = this.queue[this.currentIndex];
    
    if (prevSong) {
      this.currentSong = prevSong;
      if (this.audio) {
        this.audio.src = prevSong.audioUrl;
        this.audio.load();
        this.audio.play().catch(err => {
          console.error('Error playing previous song:', err);
          this.handlePlayError(err, prevSong);
        });
        
        if (this.onSongChange) {
          this.onSongChange(prevSong);
        }
      }
    }
  }

  pause() {
    this.audio?.pause();
  }

  resume() {
    this.audio?.play();
  }

  togglePlayPause() {
    if (this.audio?.paused) {
      this.audio?.play();
    } else {
      this.audio?.pause();
    }
  }

  getCurrentTime() {
    return this.audio?.currentTime || 0;
  }
  
  getDuration() {
    return this.audio?.duration || 0;
  }
  
  seekTo(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }
  
  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = volume / 100;
    }
  }
  
  isPlaying() {
    return this.audio ? !this.audio.paused : false;
  }
  
  getCurrentSong() {
    return this.currentSong;
  }
  
  getQueue() {
    return [...this.queue];
  }
  
  isLoading() {
    return this.isLoadingState;
  }
  
  // Clean up resources when component unmounts
  cleanup() {
    if (this.bufferingTimeout !== null) {
      clearTimeout(this.bufferingTimeout);
      this.bufferingTimeout = null;
    }
    
    this.shouldBePlayingWhenReady = false;
    
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }
    
    this.onTimeUpdate = null;
    this.onSongChange = null;
    this.onLoadingChange = null;
    this.onError = null;
    this.onBuffering = null;
  }

  // Ensure these methods are implemented
  setRepeatMode(repeat: boolean): void {
    this.isRepeatMode = repeat;
    if (this.audio) {
      this.audio.loop = repeat;
    }
  }

  setShuffleMode(shuffle: boolean): void {
    this.isShuffleMode = shuffle;
    
    if (shuffle) {
      // Save the original queue if not saved already
      if (this.originalQueue.length === 0) {
        this.originalQueue = [...this.queue];
      }
      
      // Shuffle the queue while keeping current song at current index
      const currentSong = this.queue[this.currentIndex];
      const remainingItems = this.queue.filter(song => song.id !== currentSong.id);
      
      // Fisher-Yates shuffle algorithm
      for (let i = remainingItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingItems[i], remainingItems[j]] = [remainingItems[j], remainingItems[i]];
      }
      
      // Put current song back at current index
      this.queue = [...remainingItems.slice(0, this.currentIndex), 
                    currentSong,
                    ...remainingItems.slice(this.currentIndex)];
    } else {
      // Restore original queue
      if (this.originalQueue.length > 0) {
        const currentSong = this.queue[this.currentIndex];
        this.queue = [...this.originalQueue];
        // Find the current song in the original queue
        this.currentIndex = this.queue.findIndex(song => song.id === currentSong.id);
        if (this.currentIndex === -1) this.currentIndex = 0;
      }
    }
  }
}

// Define type explicitly to help TypeScript
interface IAudioService {
  onTimeUpdate: ((currentTime: number, duration: number) => void) | null;
  onSongChange: ((song: any) => void) | null;
  onLoadingChange: ((isLoading: boolean) => void) | null;
  onError: ((message: string) => void) | null;
  onBuffering: ((isBuffering: boolean) => void) | null;
  initialize(): IAudioService; // Return IAudioService instead of AudioService
  play(song: any): void;
  playPrevious(): void;
  playNext(): void;
  pause(): void;
  resume(): void;
  togglePlayPause(): void;
  getCurrentTime(): number;
  getDuration(): number;
  seekTo(time: number): void;
  setVolume(volume: number): void;
  isPlaying(): boolean;
  getCurrentSong(): any;
  getQueue(): any[];
  isLoading(): boolean;
  loadSong(song: any): void;
  setQueue(songs: any[]): void;
  setRepeatMode(repeat: boolean): void;
  setShuffleMode(shuffle: boolean): void;
  cleanup(): void;
}

// Export as IAudioService type
export const audioService: IAudioService = new AudioService().initialize();
