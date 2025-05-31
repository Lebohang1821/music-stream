import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define artists with their associated songs
const artistsData = [
	{
		id: 1,
		name: 'M1llion Records',
		image: '/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png',
		followers: '1.2M',
		topSong: {
			id: 4,
			title: 'Am i next (feat. IVson & 1821Beats)',
			artist: 'M1llion Records',
			album: 'Single',
			cover: '/lovable-uploads/c8129615-f051-4845-875a-ca371dd8b8cf.png',
			duration: '3:42',
			audioUrl: '/Am-I-Next.mp3',
		},
	},
	{
		id: 2,
		name: '1821BEATs',
		image: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
		followers: '872K',
		topSong: {
			id: 1,
			title: 'Umkami (feat. Dropper & Danger Awuyidede)',
			artist: '1821BEATs',
			cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
			album: 'Single',
			duration: '3:45',
			audioUrl: '/1821BEATs - Umkami (feat. Danger_M & Dropper).mp3',
		},
	},
	{
		id: 3,
		name: 'Seniior 2.0',
		image: '/lovable-uploads/e4444866-dd49-4eba-8e4b-77f986af7743.png',
		followers: '542K',
		topSong: {
			id: 2,
			title: 'Hieroglyphs (feat. Seniior 2.0)',
			artist: '1821BEATs',
			cover: '/lovable-uploads/44e55910-a21d-4a80-b8d3-db1f3f5272be.png',
			album: 'UnLocked',
			duration: '3:22',
			audioUrl: '/1821BEATs & Seniiior 2.0 - Hieroglyphs-2.mp3',
		},
	},
	{
		id: 4,
		name: 'Moolah Mali',
		image: '/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png',
		followers: '329K',
		topSong: {
			id: 5,
			title: 'Shawty (feat. Moolah Mali)',
			artist: 'M1llion Records',
			album: 'Single',
			cover: '/lovable-uploads/47dd00ee-9610-41fa-a90f-9ec10a577d4f.png',
			duration: '3:15',
			audioUrl: '/Shawty.mp3',
		},
	},
];

interface PopularArtistsProps {
	onSongSelect?: (song: any) => void;
}

export function PopularArtists({ onSongSelect }: PopularArtistsProps) {
	const navigate = useNavigate();
	const [hoveredArtist, setHoveredArtist] = useState<number | null>(null);
	const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});

	const handleArtistClick = (artistId: number) => {
		// In a real app, this would navigate to the artist page
		navigate(`/artist/${artistId}`);
	};

	const handlePlayArtist = (e: React.MouseEvent, artist: any) => {
		e.stopPropagation();
		if (onSongSelect && artist.topSong) {
			onSongSelect(artist.topSong);
		}
	};

	// Handle image loading errors
	const handleImageError = (artistId: number) => {
		setImageErrors(prev => ({...prev, [artistId]: true}));
	};

	return (
		<div className="mt-8">
			<h2 className="text-2xl font-bold mb-4">Popular Artists</h2>
			
			<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{artistsData.map((artist) => (
					<div
						key={artist.id}
						className="relative group cursor-pointer"
						onClick={() => handleArtistClick(artist.id)}
						onMouseEnter={() => setHoveredArtist(artist.id)}
						onMouseLeave={() => setHoveredArtist(null)}
					>
						<div className="aspect-square rounded-full overflow-hidden relative bg-black/20">
							{imageErrors[artist.id] ? (
								<div className="w-full h-full flex items-center justify-center bg-purple-800/40">
									<ImageOff size={48} className="text-white/60" />
								</div>
							) : (
								<img
									src={artist.image}
									alt={artist.name}
									className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									onError={() => handleImageError(artist.id)}
									loading="lazy"
								/>
							)}
							<div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
								{hoveredArtist === artist.id && (
									<Button
										onClick={(e) => handlePlayArtist(e, artist)}
										className="bg-white text-black hover:bg-white/90 rounded-full w-12 h-12 flex items-center justify-center"
									>
										<Play size={22} fill="currentColor" className="ml-1" />
									</Button>
								)}
							</div>
						</div>
						<div className="mt-2 text-center">
							<h3 className="font-medium text-white truncate">{artist.name}</h3>
							<p className="text-sm text-white/60">
								{artist.followers} followers
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
