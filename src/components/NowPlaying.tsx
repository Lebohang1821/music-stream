import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle, Home, Search, Library, Plus, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface NowPlayingProps {
  currentSong: {
    title: string;
    artist: string;
    album: string;
    cover: string;
    duration: string;
    currentTime?: string;
    audioUrl?: string;
  };
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSongSelect: (song: any) => void;
  isMobile?: boolean;
  progress?: number;
  onSeek?: (value: number[]) => void;
  onVolumeChange?: (value: number[]) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isLoading?: boolean;
}

const navigationItems = [
  { title: "Home", icon: Home, url: "home" },
  { title: "Search", icon: Search, url: "search" },
  { title: "Your Library", icon: Library, url: "library" }
];

const libraryItems = [
  { title: "Create Playlist", icon: Plus, url: "create" },
  { title: "Liked Songs", icon: Heart, url: "liked" },
  { title: "Downloaded", icon: Download, url: "downloaded" }
];

const playlists = [
  "My Playlist #1",
  "Chill Vibes",
  "Workout Mix",
  "Road Trip",
  "Study Session"
];

export function NowPlaying({ 
  currentSong, 
  isPlaying, 
  setIsPlaying, 
  currentTab, 
  setCurrentTab, 
  onSongSelect, 
  isMobile = false,
  progress = 0,
  onSeek,
  onVolumeChange,
  onPrevious,
  onNext,
  isLoading = false
}: NowPlayingProps) {
  const [volume, setVolume] = useState([75]);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);

  // Handle volume changes
  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (onVolumeChange) {
      onVolumeChange(value);
    }
  };

  // Handle seek changes
  const handleSeek = (value: number[]) => {
    if (onSeek) {
      onSeek(value);
    }
  };

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-80 h-screen flex-shrink-0'} bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col`}>
      {/* Header - Fixed */}
      <div className={`p-6 border-b border-white/10 ${isMobile ? 'pt-16' : ''} flex-shrink-0`}>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          MusicStream
        </h1>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => setCurrentTab(item.url)}
                className={`w-full justify-start space-x-3 hover:bg-white/10 transition-all duration-200 ${
                  currentTab === item.url ? 'bg-white/20 text-white' : 'text-white/80'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-white/60 text-sm font-semibold mb-3">YOUR LIBRARY</h3>
            {libraryItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                onClick={() => setCurrentTab(item.url)}
                className={`w-full justify-start space-x-3 hover:bg-white/10 transition-all duration-200 ${
                  currentTab === item.url ? 'bg-white/20 text-white' : 'text-white/80'
                }`}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.title}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="text-white/60 text-sm font-semibold mb-3">PLAYLISTS</h3>
            {playlists.map((playlist) => (
              <Button
                key={playlist}
                variant="ghost"
                onClick={() => setCurrentTab(`playlist-${playlist}`)}
                className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 text-sm py-1"
              >
                {playlist}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Now Playing Section - Hide on mobile as it's shown at bottom */}
      {!isMobile && (
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={currentSong.cover} 
                alt={currentSong.title}
                className="w-16 h-16 rounded-lg shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate text-sm">{currentSong.title}</h4>
                <p className="text-white/70 text-xs truncate">{currentSong.artist}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsLiked(!isLiked)}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-green-500" : ""} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[progress]}
                onValueChange={handleSeek}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>{currentSong.currentTime || "0:00"}</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-white/60 hover:text-white hover:bg-white/10 ${isShuffleOn ? 'text-green-500' : ''}`}
                onClick={() => setIsShuffleOn(!isShuffleOn)}
                disabled={isLoading}
              >
                <Shuffle size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10"
                onClick={onPrevious}
                disabled={isLoading}
              >
                <SkipBack size={18} />
              </Button>
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white text-black hover:bg-white/90 w-8 h-8 rounded-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/80 hover:text-white hover:bg-white/10"
                onClick={onNext}
                disabled={isLoading}
              >
                <SkipForward size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-white/60 hover:text-white hover:bg-white/10 ${isRepeatOn ? 'text-green-500' : ''}`}
                onClick={() => setIsRepeatOn(!isRepeatOn)}
                disabled={isLoading}
              >
                <Repeat size={16} />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Volume2 size={16} className="text-white/60" />
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
