class AudioService {
  private audio: HTMLAudioElement | null = null;
  private currentSong: any = null;
  private queue: any[] = [];
  private originalQueue: any[] = [];
  private currentIndex: number = -1;
  private isShuffleMode: boolean = false;
  private isRepeatMode: boolean = false;
  private isLoadingState: boolean = false;

  initialize() {
    if (!this.audio) {
      this.audio = new Audio();
      this.setupAudioEvents();
    }
    return this;
  }

  private setupAudioEvents() {
    if (!this.audio) return;
    
    // Track loading state
    this.audio.addEventListener('loadstart', () => {
      this.isLoadingState = true;
      if (this.onLoadingChange) {
        this.onLoadingChange(true);
      }
    });
    
    this.audio.addEventListener('canplay', () => {
      this.isLoadingState = false;
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
    });
    
    this.audio.addEventListener('error', () => {
      this.isLoadingState = false;
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
      console.error('Audio error occurred');
    });
    
    this.audio.addEventListener('ended', () => {
      // Auto-play next song when current song ends
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

  onTimeUpdate: ((currentTime: number, duration: number) => void) | null = null;
  onSongChange: ((song: any) => void) | null = null;
  onLoadingChange: ((isLoading: boolean) => void) | null = null;

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

  play(song: any) {
    if (!this.audio) return;
    
    // If it's the same song, just toggle play/pause
    if (this.currentSong && this.currentSong.id === song.id) {
      if (this.audio.paused) {
        this.audio.play().catch(err => console.error('Error playing audio:', err));
      } else {
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
    if (this.onLoadingChange) {
      this.onLoadingChange(true);
    }
    
    // Load and play the new song
    this.currentSong = song;
    this.audio.src = song.audioUrl;
    this.audio.load();
    this.audio.play().catch(err => {
      console.error('Error playing audio:', err);
      this.isLoadingState = false;
      if (this.onLoadingChange) {
        this.onLoadingChange(false);
      }
    });
  }

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
        this.audio.play();
        
        if (this.onSongChange) {
          this.onSongChange(prevSong);
        }
      }
    }
  }

  setRepeatMode(repeat: boolean) {
    this.isRepeatMode = repeat;
    if (this.audio) {
      this.audio.loop = repeat;
    }
  }

  setShuffleMode(shuffle: boolean) {
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

  // Update the playNext method to handle repeat
  playNext() {
    if (this.queue.length === 0) return;
    
    if (this.isRepeatMode && this.currentSong) {
      // In repeat mode, just restart the current song
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play();
      }
      return;
    }
    
    // Move to next track
    this.currentIndex = (this.currentIndex + 1) % this.queue.length;
    const nextSong = this.queue[this.currentIndex];
    
    if (nextSong) {
      this.currentSong = nextSong;
      if (this.audio) {
        this.audio.src = nextSong.audioUrl;
        this.audio.load();
        this.audio.play();
        
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
}

// Export a singleton instance
export const audioService = new AudioService().initialize();
