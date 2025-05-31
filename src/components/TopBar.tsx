
import { Search, User, ChevronLeft, ChevronRight, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopBarProps {
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  onUpgrade: () => void;
}

export function TopBar({ showProfile, setShowProfile, onUpgrade }: TopBarProps) {
  const handleSignOut = () => {
    console.log('Signing out...');
    // Add sign out logic here
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // Add settings logic here
  };

  return (
    <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
            <ChevronRight size={20} />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={18} />
          <Input 
            placeholder="Search songs, artists, albums..." 
            className="pl-10 w-96 bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onUpgrade}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-6"
        >
          Upgrade to Pro
        </Button>
        
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
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-white/70">john@example.com</p>
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
