
import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { MainContent } from '@/components/MainContent';
import { NowPlaying } from '@/components/NowPlaying';
import { Queue } from '@/components/Queue';

const Index = () => {
  const [currentSong, setCurrentSong] = useState({
    title: "Am i next (feat. IVson & 1821Beats)",
    artist: "M1llion Records",
    album: "Single",
    cover: "/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png",
    duration: "3:42",
    currentTime: "1:23"
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState("home");
  const [showProfile, setShowProfile] = useState(false);

  const handleSongSelect = (song: any) => {
    setCurrentSong({
      title: song.title,
      artist: song.artist,
      album: song.album,
      cover: song.cover,
      duration: song.duration,
      currentTime: "0:00"
    });
    setIsPlaying(true);
  };

  const handleUpgrade = () => {
    window.open('https://example.com/upgrade', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white w-full">
      <div className="flex h-screen">
        <NowPlaying 
          currentSong={currentSong} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onSongSelect={handleSongSelect}
        />
        <div className="flex-1 flex flex-col">
          <TopBar 
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            onUpgrade={handleUpgrade}
          />
          <div className="flex flex-1 overflow-hidden">
            <MainContent currentTab={currentTab} onSongSelect={handleSongSelect} />
            <Queue currentSong={currentSong} onSongSelect={handleSongSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
