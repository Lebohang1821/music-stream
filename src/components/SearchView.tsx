
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { RecentlyPlayed } from '@/components/RecentlyPlayed';

interface SearchViewProps {
  onSongSelect: (song: any) => void;
}

export function SearchView({ onSongSelect }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
          <Input 
            placeholder="What do you want to listen to?" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20"
          />
        </div>
      </div>
      
      {searchQuery ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <RecentlyPlayed onSongSelect={onSongSelect} />
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          <RecentlyPlayed onSongSelect={onSongSelect} />
        </div>
      )}
    </div>
  );
}
