import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobilePlayerProps {
  currentSong: {
    title: string;
    artist: string;
    album?: string;
    cover: string;
    duration: string;
    currentTime?: string;
  };
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onExpand: () => void;
  progress?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  isLoading?: boolean;
  isBuffering?: boolean;
}

export function MobilePlayer({ 
  currentSong, 
  isPlaying, 
  setIsPlaying, 
  onExpand,
  progress = 0,
  onPrevious,
  onNext,
  isLoading = false,
  isBuffering = false
}: MobilePlayerProps) {
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 py-2 px-3 z-50 md:hidden">
      {/* Progress bar at the top of the player */}
      <div className="w-full bg-white/10 h-1 mb-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-200 ease-linear" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex items-center">
        {/* Album/song info - clickable to expand player */}
        <div className="flex items-center flex-1 min-w-0" onClick={onExpand}>
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-10 h-10 rounded-md mr-3"
          />
          <div className="truncate">
            <h4 className="text-sm font-medium text-white truncate">{currentSong.title}</h4>
            <p className="text-xs text-white/70 truncate">{currentSong.artist}</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
            onClick={onPrevious}
            disabled={isLoading}
          >
            <SkipBack size={16} />
          </Button>
          <Button 
            onClick={handlePlayPauseClick}
            className="bg-white text-black hover:bg-white/90 w-8 h-8 rounded-full flex items-center justify-center p-0"
            disabled={isLoading}
          >
            {isLoading || isBuffering ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={14} />
            ) : (
              <Play size={14} />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/80 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
            onClick={onNext}
            disabled={isLoading}
          >
            <SkipForward size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
