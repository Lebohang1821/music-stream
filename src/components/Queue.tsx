import { Play, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueueProps {
  currentSong: any;
  onSongSelect: (song: any) => void;
}

// Use our actual songs with audio files including the new additions
const queueSongs = [
  {
    id: 1,
    title: "Am i next (feat. IVson & 1821Beats)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    duration: "3:42",
    audioUrl: "/Am-I-Next.mp3"
  },
  {
    id: 2,
    title: "Shawty (feat. Moolah Mali)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png",
    duration: "3:15",
    audioUrl: "/Shawty.mp3"
  },
  {
    id: 3,
    title: "Umkami (feat. Dropper & Danger Awuyidede)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    duration: "3:45",
    audioUrl: "/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3"
  },
  {
    id: 4,
    title: "Hieroglyphs (feat. Seniior 2.0)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    duration: "3:22",
    audioUrl: "/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3"
  },
  {
    id: 5,
    title: "Man In Black (feat. IVson)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png",
    duration: "3:50",
    audioUrl: "/Man In Black.mp3"
  }
];

export function Queue({ currentSong, onSongSelect }: QueueProps) {
  return (
    <div className="h-full w-full bg-black/20 backdrop-blur-xl border-l border-white/10 flex flex-col max-w-[320px] md:max-w-none">
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <h2 className="text-xl font-semibold">Next in Queue</h2>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <div className="p-2">
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
      </div>
    </div>
  );
}
