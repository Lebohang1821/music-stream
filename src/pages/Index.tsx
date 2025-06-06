import { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/TopBar';
import { MainContent } from '@/components/MainContent';
import { NowPlaying } from '@/components/NowPlaying';
import { Queue } from '@/components/Queue';
import { MobilePlayer } from '@/components/MobilePlayer';
import { ChevronLeft, ChevronRight, Menu, X, SkipBack, SkipForward, Play, Pause, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { audioService } from '@/services/audioService';
import { toast } from "@/components/ui/sonner";
import { createSafeAudioUrl, formatTime } from '@/utils/audioUtils';

// Song mapping for the available audio files
const songData = {
  umkami: {
    id: 1,
    title: "Umkami (feat. Dropper & Danger Awuyidede)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    album: "Single",
    duration: "3:45",
    audioUrl: "/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3"
  },
  hieroglyphs: {
    id: 2,
    title: "Hieroglyphs (feat. Seniior 2.0)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    album: "UnLocked",
    duration: "3:22",
    audioUrl: "/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3"
  },
  manInBlack: {
    id: 3,
    title: "Man In Black (feat. IVson)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png",
    album: "Single",
    duration: "3:50",
    audioUrl: "/Man In Black.mp3"
  },
  amINext: {
    id: 4,
    title: "Am i next (feat. IVson & 1821Beats)",
    artist: "M1llion Records",
    album: "Single",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    duration: "3:42",
    // Now using the actual Am i next song file
    audioUrl: "/Am-I-Next.mp3"
  },
  shawty: {
    id: 5,
    title: "Shawty (feat. Moolah Mali)",
    artist: "M1llion Records",
    album: "Single",
    cover: "/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png",
    duration: "3:15",
    audioUrl: "/Shawty.mp3"
  }
};

const Index = () => {
  const [currentSong, setCurrentSong] = useState(songData.amINext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const [showQueue, setShowQueue] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showFullMobilePlayer, setShowFullMobilePlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioErrorCount, setAudioErrorCount] = useState(0);
  const [failedSongs, setFailedSongs] = useState<Record<string, boolean>>({});
  
  // Initialize queue on component mount
  useEffect(() => {
    // Set the initial queue with all available songs - with properly encoded URLs
    const allSongs = Object.values(songData).map(song => ({
      ...song,
      audioUrl: createSafeAudioUrl(song.audioUrl) // Ensure URLs are properly formatted
    }));
    audioService.setQueue(allSongs);
    
    // Listen for song changes from the audio service
    audioService.onSongChange = (song) => {
      if (song) {
        setCurrentSong(song);
        setIsPlaying(true);
        // Always reset these values when song changes
        setCurrentTime('0:00');
        setProgress(0);
      }
    };
    
    // Handle audio errors
    audioService.onError = (message) => {
      if (currentSong) {
        // Track failed songs
        setFailedSongs(prev => ({
          ...prev,
          [currentSong.id]: true
        }));
        
        // Show user friendly error
        toast.error("Audio Playback Error", {
          description: "There was a problem playing this song. Try another one.",
          action: {
            label: "Next Song",
            onClick: () => handleNext()
          }
        });
      }
    };
    
    return () => {
      audioService.onSongChange = null;
      audioService.onError = null;
    };
  }, []);

  // Track audio playback with improved time formatting
  useEffect(() => {
    audioService.onTimeUpdate = (time, duration) => {
      // Format time as mm:ss
      setCurrentTime(formatTime(time));
      
      // Update progress (0-100)
      setProgress(duration > 0 ? (time / duration) * 100 : 0);
    };
    
    return () => {
      audioService.onTimeUpdate = null;
    };
  }, []);

  // Detect mobile screens
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Handle playing status updates
  useEffect(() => {
    if (isPlaying) {
      audioService.resume();
    } else {
      audioService.pause();
    }
  }, [isPlaying]);

  const handleSongSelect = (song: any) => {
    // If this song previously failed, try a different one
    if (failedSongs[song.id]) {
      toast.info("Trying alternative", {
        description: "The previous song couldn't be loaded. Trying a different one."
      });
      
      // Find another song that hasn't failed
      const availableSongs = Object.values(songData).filter(s => !failedSongs[s.id]);
      if (availableSongs.length > 0) {
        song = availableSongs[0];
      }
    }
    
    // Map to our audio files and create safe URLs
    let audioSong = { ...song };
    
    // Try to match by title to our available songs
    Object.values(songData).forEach(availableSong => {
      if (availableSong.title === song.title) {
        audioSong = { 
          ...song, 
          audioUrl: createSafeAudioUrl(availableSong.audioUrl)
        };
      }
    });
    
    // Reset progress for new song
    setCurrentTime('0:00');
    setProgress(0);
    
    setCurrentSong(audioSong);
    setIsLoading(true);
    audioService.play(audioSong);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    // If this is the first time playing and no song has been loaded yet
    if (!audioService.getCurrentSong()) {
      audioService.loadSong(currentSong);
    }
    
    if (isPlaying) {
      audioService.pause();
    } else {
      audioService.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const time = (value[0] / 100) * audioService.getDuration();
    audioService.seekTo(time);
  };

  const handleVolumeChange = (value: number[]) => {
    audioService.setVolume(value[0]);
  };

  const handleUpgrade = () => {
    window.open('https://example.com/upgrade', '_blank');
  };

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  const toggleMobileNav = () => {
    setShowMobileNav(!showMobileNav);
    if (showFullMobilePlayer) setShowFullMobilePlayer(false);
  };

  const expandMobilePlayer = () => {
    setShowFullMobilePlayer(true);
    setShowMobileNav(false);
  };

  // Handle previous button click (fix method name)
  const handlePrevious = () => {
    audioService.playPrevious();
  };

  // Handle next button click
  const handleNext = () => {
    audioService.playNext();
  };

  // Pass buffering state to components that need it
  const playerState = {
    isLoading,
    isBuffering,
    isPlaying
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white w-full flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Nav Toggle Button */}
        <div className="md:hidden fixed top-4 left-4 z-30">
          <Button 
            variant="ghost" 
            size="sm"
            className="bg-black/20 backdrop-blur-xl text-white hover:bg-black/30"
            onClick={toggleMobileNav}
          >
            {showMobileNav ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
        
        {/* NowPlaying - Sidebar - with updated props for desktop controls */}
        <div className={`${isMobile ? 'fixed inset-0 z-20' : ''} ${showMobileNav ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''} transition-transform duration-300`}>
          <NowPlaying 
            currentSong={{...currentSong, currentTime}}
            isPlaying={isPlaying} 
            isBuffering={isBuffering}
            setIsPlaying={setIsPlaying}
            currentTab={currentTab}
            setCurrentTab={(tab) => {
              setCurrentTab(tab);
              if (isMobile) setShowMobileNav(false);
            }}
            onSongSelect={handleSongSelect}
            isMobile={isMobile}
            progress={progress}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isLoading={isLoading}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar 
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            onUpgrade={handleUpgrade}
            isMobile={isMobile}
          />
          <div className="flex flex-1 overflow-hidden pb-[72px] md:pb-0">
            <MainContent currentTab={currentTab} onSongSelect={handleSongSelect} />
            
            {/* Queue */}
            <div className="relative flex">
              {/* Toggle button for Queue */}
              <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="rounded-full w-6 h-12 p-0 flex items-center justify-center shadow-lg"
                  onClick={toggleQueue}
                >
                  {showQueue ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
              </div>
              
              <div className={`transition-all duration-300 ease-in-out ${showQueue ? 'w-80' : 'w-0 overflow-hidden'}`}>
                <Queue currentSong={currentSong} onSongSelect={handleSongSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile player bar with loading indicator */}
      {isMobile && !showFullMobilePlayer && (
        <MobilePlayer 
          currentSong={currentSong}
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          setIsPlaying={setIsPlaying}
          onExpand={expandMobilePlayer}
          progress={progress}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isLoading={isLoading}
        />
      )}
      
      {/* Full screen mobile player with loading indicator */}
      {isMobile && (
        <div className={`fixed inset-0 bg-black/90 backdrop-blur-xl z-40 transition-transform duration-300 ${showFullMobilePlayer ? 'translate-y-0' : 'translate-y-full'}`}>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white"
            onClick={() => setShowFullMobilePlayer(false)}
          >
            <X size={24} />
          </Button>
          
          <div className="flex flex-col items-center justify-center h-full p-6 space-y-8">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-64 h-64 rounded-lg shadow-2xl"
            />
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{currentSong.title}</h2>
              <p className="text-white/70">{currentSong.artist}</p>
            </div>
            
            <div className="w-full max-w-md space-y-6">
              {/* Progress bar placeholder */}
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{width: `${progress}%`}}></div>
              </div>
              
              <div className="flex justify-between text-sm text-white/50">
                <span>{currentTime}</span>
                <span>{currentSong.duration}</span>
              </div>
              
              <div className="flex items-center justify-center space-x-6">
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  <SkipBack size={24} />
                </Button>
                <Button 
                  onClick={handlePlayPause}
                  className="bg-white text-black hover:bg-white/90 h-16 w-16 rounded-full flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 size={32} className="animate-spin" />
                  ) : isPlaying ? (
                    <Pause size={32} /> 
                  ) : (
                    <Play size={32} className="ml-1" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  <SkipForward size={24} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
