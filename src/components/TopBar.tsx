import { Search, User, ChevronLeft, ChevronRight, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopBarProps {
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  onUpgrade: () => void;
  isMobile?: boolean;
}

export function TopBar({ showProfile, setShowProfile, onUpgrade, isMobile = false }: TopBarProps) {
  const handleSignOut = () => {
    console.log('Signing out...');
    // Add sign out logic here
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Add settings logic here
  };

  return (
    <div className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
      {/* Mobile spacing for menu button */}
      {isMobile && <div className="w-8"></div>}
      
      <div className="flex-1 max-w-md">
        <div className="relative">
          {/* Search input - hide on smallest screens */}
          <input
            type="text"
            placeholder="Search for songs, artists, albums..."
            className="w-full bg-white/10 border border-white/20 rounded-full py-2 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 hidden sm:block"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <button 
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-1.5 px-3 md:px-4 rounded-full text-xs md:text-sm font-medium hover:opacity-90 transition-opacity"
          onClick={onUpgrade}
        >
          Upgrade to Premium
        </button>
        
        <Popover open={showProfile} onOpenChange={setShowProfile}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-purple-600 text-white">
                  <User size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-black/90 border-white/20 text-white">
            <div className="space-y-2">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">Jabulani John Ndlovu</p>
                <p className="text-xs text-white/70">charles101@gmail.com</p>
              </div>
              <div className="border-t border-white/20 pt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={handleSettings}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
