import { FeaturedSection } from '@/components/FeaturedSection';
import { RecentlyPlayed } from '@/components/RecentlyPlayed';
import { PopularArtists } from '@/components/PopularArtists';
import { TrendingPlaylists } from '@/components/TrendingPlaylists';
import { SearchView } from '@/components/SearchView';
import { LibraryView } from '@/components/LibraryView';

interface MainContentProps {
  currentTab: string;
  onSongSelect: (song: any) => void;
}

export function MainContent({ currentTab, onSongSelect }: MainContentProps) {
  const renderContent = () => {
    switch (currentTab) {
      case 'search':
        return <SearchView onSongSelect={onSongSelect} />;
      case 'library':
        return <LibraryView onSongSelect={onSongSelect} />;
      case 'liked':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold">Liked Songs</h1>
            <RecentlyPlayed onSongSelect={onSongSelect} />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <FeaturedSection onSongSelect={onSongSelect} />
            <RecentlyPlayed onSongSelect={onSongSelect} />
            <PopularArtists onSongSelect={onSongSelect} />
            <TrendingPlaylists onSongSelect={onSongSelect} />
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      {renderContent()}
    </div>
  );
}
