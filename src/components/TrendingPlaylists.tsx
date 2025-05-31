import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define playlists with their songs
const playlistsData = [
	{
		id: 1,
		title: 'Top SA Hip-Hop',
		description: 'The best South African Hip-Hop tracks',
		cover: '/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png',
		songs: [
			{
				id: 4,
				title: 'Am i next (feat. IVson & 1821Beats)',
				artist: 'M1llion Records',
				album: 'Single',
				cover: '/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png',
				duration: '3:42',
				audioUrl: '/Am-I-Next.mp3',
			},
			{
				id: 5,
				title: 'Shawty (feat. Moolah Mali)',
				artist: 'M1llion Records',
				album: 'Single',
				cover: '/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png',
				duration: '3:15',
				audioUrl: '/Shawty.mp3',
			},
		],
	},
	{
		id: 2,
		title: '1821BEATs Collection',
		description: 'Best tracks from 1821BEATs',
		cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
		songs: [
			{
				id: 1,
				title: 'Umkami (feat. Dropper & Danger Awuyidede)',
				artist: '1821BEATs',
				cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
				album: 'Single',
				duration: '3:45',
				audioUrl: '/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3',
			},
			{
				id: 2,
				title: 'Hieroglyphs (feat. Seniior 2.0)',
				artist: '1821BEATs',
				cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
				album: 'UnLocked',
				duration: '3:22',
				audioUrl: '/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3',
			},
		],
	},
	{
		id: 3,
		title: 'Million Records Hits',
		description: 'Top tracks from Million Records',
		cover: '/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png',
		songs: [
			{
				id: 3,
				title: 'Man In Black (feat. IVson)',
				artist: 'M1llion Records',
				cover: '/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png',
				album: 'Single',
				duration: '3:50',
				audioUrl: '/Man In Black.mp3',
			},
			{
				id: 4,
				title: 'Am i next (feat. IVson & 1821Beats)',
				artist: 'M1llion Records',
				album: 'Single',
				cover: '/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png',
				duration: '3:42',
				audioUrl: '/Am-I-Next.mp3',
			},
		],
	},
	{
		id: 4,
		title: 'Local Collaborations',
		description: 'Best collaborative tracks',
		cover: '/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png',
		songs: [
			{
				id: 5,
				title: 'Shawty (feat. Moolah Mali)',
				artist: 'M1llion Records',
				album: 'Single',
				cover: '/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png',
				duration: '3:15',
				audioUrl: '/Shawty.mp3',
			},
			{
				id: 2,
				title: 'Hieroglyphs (feat. Seniior 2.0)',
				artist: '1821BEATs',
				cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
				album: 'UnLocked',
				duration: '3:22',
				audioUrl: '/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3',
			},
		],
	},
];

interface TrendingPlaylistsProps {
	onSongSelect?: (song: any) => void;
}

export function TrendingPlaylists({ onSongSelect }: TrendingPlaylistsProps) {
	const navigate = useNavigate();

	const handlePlaylistClick = (playlistId: number) => {
		// In a real app, this would navigate to the playlist page
		navigate(`/playlist/${playlistId}`);
	};

	const handlePlayPlaylist = (e: React.MouseEvent, playlist: any) => {
		e.stopPropagation();
		if (onSongSelect && playlist.songs && playlist.songs.length > 0) {
			// Play the first song in the playlist
			onSongSelect(playlist.songs[0]);
		}
	};

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-bold mb-4">Trending Playlists</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{playlistsData.map((playlist) => (
					<div
						key={playlist.id}
						className="bg-white/5 rounded-lg overflow-hidden group cursor-pointer transition-all hover:bg-white/10"
						onClick={() => handlePlaylistClick(playlist.id)}
					>
						<div className="relative">
							<img
								src={playlist.cover}
								alt={playlist.title}
								className="w-full aspect-square object-cover"
							/>
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
								<Button
									onClick={(e) => handlePlayPlaylist(e, playlist)}
									className="bg-white text-black hover:bg-white/90 rounded-full w-12 h-12 flex items-center justify-center"
								>
									<Play size={22} fill="currentColor" className="ml-1" />
								</Button>
							</div>
						</div>
						<div className="p-3">
							<h3 className="font-medium text-white truncate">
								{playlist.title}
							</h3>
							<p className="text-sm text-white/60 truncate">
								{playlist.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
