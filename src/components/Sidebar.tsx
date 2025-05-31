
import { Home, Search, Library, Plus, Heart, Download } from 'lucide-react';
import { 
  Sidebar as SidebarPrimitive, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const navigationItems = [
  { title: "Home", icon: Home, url: "home" },
  { title: "Search", icon: Search, url: "search" },
  { title: "Your Library", icon: Library, url: "library" }
];

const libraryItems = [
  { title: "Create Playlist", icon: Plus, url: "create" },
  { title: "Liked Songs", icon: Heart, url: "liked" },
  { title: "Downloaded", icon: Download, url: "downloaded" }
];

const playlists = [
  "My Playlist #1",
  "Chill Vibes",
  "Workout Mix",
  "Road Trip",
  "Study Session"
];

export function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  return (
    <SidebarPrimitive className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
      <SidebarContent className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            MusicStream
          </h1>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`hover:bg-white/10 transition-all duration-200 ${
                      currentTab === item.url ? 'bg-white/20 text-white' : 'text-white/80'
                    }`}
                  >
                    <button 
                      onClick={() => setCurrentTab(item.url)}
                      className="flex items-center space-x-3 w-full text-left hover:text-white"
                    >
                      <item.icon size={20} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-white/60 text-sm font-semibold mb-4">
            YOUR LIBRARY
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`hover:bg-white/10 transition-all duration-200 ${
                      currentTab === item.url ? 'bg-white/20 text-white' : 'text-white/80'
                    }`}
                  >
                    <button 
                      onClick={() => setCurrentTab(item.url)}
                      className="flex items-center space-x-3 w-full text-left hover:text-white"
                    >
                      <item.icon size={18} />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-white/60 text-sm font-semibold mb-4">
            PLAYLISTS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlists.map((playlist) => (
                <SidebarMenuItem key={playlist}>
                  <SidebarMenuButton asChild className="hover:bg-white/10 transition-all duration-200">
                    <button 
                      onClick={() => setCurrentTab(`playlist-${playlist}`)}
                      className="text-white/70 hover:text-white text-sm py-1 w-full text-left"
                    >
                      {playlist}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}
