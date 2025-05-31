
import { Play } from 'lucide-react';

const playlists = [
  {
    id: 1,
    title: "M1llion Records - Top Hits",
    description: "The biggest songs from M1llion Records",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    tracks: 12
  },
  {
    id: 2,
    title: "UnLocked EP",
    description: "Complete EP by 1821BEATs",
    cover: "/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png",
    tracks: 2
  },
  {
    id: 3,
    title: "Hip-Hop Rising",
    description: "New hip-hop music on the rise",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    tracks: 40
  },
  {
    id: 4,
    title: "Underground Vibes",
    description: "Fresh underground hip-hop tracks",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
    tracks: 25
  }
];

export function TrendingPlaylists() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Trending Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            className="group bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-300 cursor-pointer"
          >
            <div className="relative mb-4">
              <img 
                src={playlist.cover} 
                alt={playlist.title}
                className="w-full aspect-square rounded-lg shadow-lg"
              />
              <button className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-400 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Play size={16} fill="currentColor" />
              </button>
            </div>
            <h3 className="font-semibold text-white mb-2">{playlist.title}</h3>
            <p className="text-white/70 text-sm mb-2">{playlist.description}</p>
            <p className="text-white/50 text-xs">{playlist.tracks} tracks</p>
          </div>
        ))}
      </div>
    </div>
  );
}
