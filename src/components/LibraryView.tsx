
import { RecentlyPlayed } from '@/components/RecentlyPlayed';
import { PopularArtists } from '@/components/PopularArtists';

interface LibraryViewProps {
  onSongSelect: (song: any) => void;
}

export function LibraryView({ onSongSelect }: LibraryViewProps) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Your Library</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recently Added</h2>
          <RecentlyPlayed onSongSelect={onSongSelect} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Artists</h2>
          <PopularArtists />
        </div>
      </div>
    </div>
  );
}
