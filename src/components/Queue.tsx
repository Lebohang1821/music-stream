
import { Play, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueProps {
  currentSong: any;
  onSongSelect: (song: any) => void;
}

const queueSongs = [
  {
    id: 1,
    title: "Hieroglyphs (feat. Seniior 2.0)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    duration: "2:45"
  },
  {
    id: 2,
    title: "Umkami (feat. Dropper & Danger Awuyidedele)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    duration: "3:06"
  },
  {
    id: 3,
    title: "Shawty (feat. Moolah M...)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png",
    duration: "3:15"
  },
  {
    id: 4,
    title: "Man In Black (feat. IVso...)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png",
    duration: "2:58"
  }
];

export function Queue({ currentSong, onSongSelect }: QueueProps) {
  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Now Playing</h2>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title}
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
              <p className="text-white/70 text-sm truncate">{currentSong.artist}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Next in Queue</h2>
        <div className="space-y-2">
          {queueSongs.map((song) => (
            <div 
              key={song.id}
              className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-200"
              onClick={() => onSongSelect(song)}
            >
              <div className="relative">
                <img 
                  src={song.cover} 
                  alt={song.title}
                  className="w-10 h-10 rounded"
                />
                <button className="absolute inset-0 bg-black/60 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={12} fill="currentColor" className="text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-medium truncate">{song.title}</h4>
                <p className="text-white/70 text-xs truncate">{song.artist}</p>
              </div>
              <span className="text-white/50 text-xs">{song.duration}</span>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 p-1 h-auto">
                <MoreHorizontal size={14} className="text-white/60" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
