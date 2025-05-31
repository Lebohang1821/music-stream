
const artists = [
  {
    id: 1,
    name: "Drake",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    followers: "85.1M"
  },
  {
    id: 2,
    name: "1821BEATs",
    image: "/lovable-uploads/d92ae9e8-5a97-4ee7-8e50-0db561171984.png",
    followers: "2.4M"
  },
  {
    id: 3,
    name: "M1llion Records",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
    followers: "3.2M"
  }
];

export function PopularArtists() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Popular Artists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <div 
            key={artist.id}
            className="group text-center cursor-pointer"
          >
            <div className="relative mb-4">
              <img 
                src={artist.image} 
                alt={artist.name}
                className="w-full aspect-square rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300"
              />
            </div>
            <h3 className="font-semibold text-white mb-1">{artist.name}</h3>
            <p className="text-white/70 text-sm">{artist.followers} followers</p>
          </div>
        ))}
      </div>
    </div>
  );
}
