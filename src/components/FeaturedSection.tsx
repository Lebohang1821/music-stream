
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedSectionProps {
  onSongSelect?: (song: any) => void;
}

export function FeaturedSection({ onSongSelect }: FeaturedSectionProps) {
  const featuredAlbum = {
    title: "UnLocked",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    description: "The latest EP from 1821BEATs featuring exclusive beats and collaborations"
  };

  const handlePlay = () => {
    if (onSongSelect) {
      onSongSelect({
        title: "Hieroglyphs (feat. Seniior 2.0)",
        artist: featuredAlbum.artist,
        album: featuredAlbum.title,
        cover: featuredAlbum.cover,
        duration: "2:45"
      });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm p-8">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 flex items-center space-x-8">
        <img 
          src={featuredAlbum.cover} 
          alt={featuredAlbum.title}
          className="w-48 h-48 rounded-xl shadow-2xl"
        />
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">FEATURED ALBUM</p>
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {featuredAlbum.title}
          </h2>
          <p className="text-2xl text-white/90 mb-4">{featuredAlbum.artist}</p>
          <p className="text-white/70 mb-6 max-w-md leading-relaxed">
            {featuredAlbum.description}
          </p>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handlePlay}
              className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-3 rounded-full flex items-center space-x-2"
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full">
              Follow
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
