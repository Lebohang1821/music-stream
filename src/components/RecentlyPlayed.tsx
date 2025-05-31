import { Play, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentlyPlayedProps {
  onSongSelect: (song: any) => void;
}

const recentlyPlayed = [
  {
    id: 1,
    title: "Shawty (feat. Moolah Mali)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png",
    album: "Single",
    duration: "3:15",
    audioUrl: "/Shawty.mp3",
    plays: 325
  },
  {
    id: 2,
    title: "Am i next (feat. IVson & 1821Beats)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    album: "Single",
    duration: "3:42",
    audioUrl: "/Am-I-Next.mp3",
    plays: 287
  },
  {
    id: 3,
    title: "Umkami (feat. Dropper & Danger Awuyidede)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    album: "Single",
    duration: "3:45",
    audioUrl: "/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3",
    plays: 214
  },
  {
    id: 4,
    title: "Man In Black (feat. IVson)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png",
    album: "Single",
    duration: "3:50",
    audioUrl: "/Man In Black.mp3",
    plays: 198
  },
  {
    id: 5,
    title: "Hieroglyphs (feat. Seniior 2.0)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    album: "UnLocked",
    duration: "3:22",
    audioUrl: "/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3",
    plays: 176
  }
];

export function RecentlyPlayed({ onSongSelect }: RecentlyPlayedProps) {
  const handleSongClick = (song: any) => {
    if (onSongSelect) {
      onSongSelect(song);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {recentlyPlayed.map((song) => (
          <div 
            key={song.id}
            className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 cursor-pointer"
            onClick={() => handleSongClick(song)}
          >
            <div className="relative mb-4">
              <img 
                src={song.cover} 
                alt={song.title}
                className="w-full aspect-square rounded-lg shadow-lg"
              />
              <button 
                className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSongClick(song);
                }}
              >
                <Play size={16} fill="currentColor" />
              </button>
            </div>
            <h3 className="font-semibold text-white mb-1 truncate">{song.title}</h3>
            <p className="text-white/70 text-sm truncate">{song.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
