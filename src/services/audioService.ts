class AudioService {
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

  initialize() {
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

  play(song: any) {
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
        this.audio.play().catch(err => {
          console.error('Error playing existing audio:', err);
          this.shouldBePlayingWhenReady = false;
          this.handlePlayError(err, song);
        });
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
    
    // Make the URL absolute and add cache-busting
    const baseUrl = window.location.origin;
    let audioUrl: string;
    
    // Handle both absolute and relative URLs
    if (song.audioUrl.startsWith('http')) {
      audioUrl = song.audioUrl;
    } else {
      // For local files in development, use relative paths
      // In production, use the full URL with origin
      if (window.location.hostname === 'localhost') {
        audioUrl = song.audioUrl;
      } else {
        // Strip leading slash if present
        const cleanPath = song.audioUrl.startsWith('/') ? song.audioUrl.substring(1) : song.audioUrl;
        audioUrl = `${baseUrl}/${cleanPath}`;
      }
    }
    
    // Add cache-busting query param
    const urlWithCache = new URL(audioUrl, baseUrl);
    urlWithCache.searchParams.append('_', Date.now().toString());
    
    try {
      this.audio.src = urlWithCache.toString();
      this.audio.load();
      
      // Set up automatic play when buffered, with audio load error handling
      if (this.shouldBePlayingWhenReady) {
        this.audio.play().catch((err) => {
          console.error('Error in initial playback:', err);
          this.handlePlayError(err, song);
        });
      }
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
}

// Export a singleton instance
export const audioService = new AudioService().initialize();
