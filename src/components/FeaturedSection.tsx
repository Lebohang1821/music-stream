import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeaturedSectionProps {
  onSongSelect: (song: any) => void;
}

// Sample featured data with actual audio files including new songs
const featured = [
  {
    id: 1,
    title: "Am i next (feat. IVson & 1821Beats)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    background: "/lovable-uploads/featured-bg-1.png",
    duration: "3:42",
    album: "Single",
    isFeatured: true,
    audioUrl: "/Am-I-Next.mp3" 
  },
  {
    id: 2,
    title: "Shawty (feat. Moolah Mali)",
    artist: "M1llion Records",
    cover: "/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png",
    background: "/lovable-uploads/featured-bg-2.png",
    duration: "3:15",
    album: "Single",
    isFeatured: true,
    audioUrl: "/Shawty.mp3"
  },
  {
    id: 3,
    title: "Umkami (feat. Dropper & Danger Awuyidede)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    background: "/lovable-uploads/featured-bg-2.png",
    duration: "3:45",
    album: "Single",
    isFeatured: true,
    audioUrl: "/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3"
  },
  {
    id: 4,
    title: "Hieroglyphs (feat. Seniior 2.0)",
    artist: "1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    background: "/lovable-uploads/featured-bg-3.png",
    duration: "3:22",
    album: "UnLocked",
    isFeatured: true,
    audioUrl: "/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3"
  }
];

export function FeaturedSection({ onSongSelect }: FeaturedSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    // Auto-rotate featured songs every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  const currentFeatured = featured[currentIndex];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Featured</h2>
      
      {/* Mobile carousel - updated with increased height for more impact */}
      <div className="md:hidden">
        <div className="relative rounded-xl overflow-hidden h-[350px] shadow-lg">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${currentFeatured.cover})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80"></div>
          
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <div className="flex space-x-2">
                {featured.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-white scale-110' : 'bg-white/30'}`}
                    onClick={() => setCurrentIndex(idx)}
                  ></button>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1 inline-block">Featured Track</span>
              <h3 className="text-2xl font-bold truncate text-white">{currentFeatured.title}</h3>
              <p className="text-white/80 text-sm mb-4">{currentFeatured.artist} · {currentFeatured.album}</p>
              
              <div className="flex space-x-3">
                <Button 
                  className="bg-white text-black hover:bg-white/90 px-6 h-10"
                  onClick={() => onSongSelect(currentFeatured)}
                >
                  <Play size={16} className="mr-2" fill="currentColor" />
                  Play
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 h-10"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop version - unchanged */}
      <div className="hidden md:block">
        <div 
          className="relative rounded-xl overflow-hidden h-60 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentFeatured.background || currentFeatured.cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center p-10">
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold mb-2">{currentFeatured.title}</h2>
              <p className="text-xl text-white/80 mb-6">{currentFeatured.artist}</p>
              
              <div className="flex space-x-4">
                <Button 
                  className="bg-white text-black hover:bg-white/90"
                  onClick={() => onSongSelect(currentFeatured)}
                >
                  <Play size={16} className="mr-2" fill="currentColor" />
                  Play
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/20">
                  View Album
                </Button>
              </div>
            </div>
          </div>
          
          {/* Indicator dots */}
          <div className="absolute bottom-4 right-6 flex space-x-1">
            {featured.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                onClick={() => setCurrentIndex(idx)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
