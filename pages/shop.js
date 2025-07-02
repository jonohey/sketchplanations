import { Fragment } from 'react';
import Head from 'next/head';
import { track } from '@vercel/analytics';
import { pageTitle } from 'helpers';
import TextHeader from 'components/TextHeader';
import { ExternalLink, Music, Palette, Mail } from 'lucide-react';

// Featured prints data - stored locally for easy management
const FEATURED_PRINTS = [
	{
		id: 'survivorship-bias',
		title: 'Survivorship bias',
		description: 'Understanding why we see more success stories than failures',
		imagePath: '/featured-prints/survivorship-bias.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/Survivorship-bias-by-sketchplanator/23563230.LVTDI'
	},
	{
		id: 'dunning-kruger',
		title: 'Dunning-Kruger effect',
		description: 'The confidence-competence relationship',
		imagePath: '/featured-prints/dunning-kruger.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/Dunning-Kruger-effect-by-sketchplanator/23563232.LVTDI'
	},
	{
		id: 'two-minute-rule',
		title: 'Two-minute rule',
		description: 'If it takes less than two minutes, do it now',
		imagePath: '/featured-prints/two-minute-rule.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/Two-minute-rule-by-sketchplanator/23563234.LVTDI'
	},
	{
		id: 'parkinson-law',
		title: "Parkinson's law",
		description: 'Work expands to fill the time available',
		imagePath: '/featured-prints/parkinson-law.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/Parkinson-s-law-by-sketchplanator/23563236.LVTDI'
	},
	{
		id: 'ikea-effect',
		title: 'IKEA effect',
		description: 'We value things more when we helped create them',
		imagePath: '/featured-prints/ikea-effect.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/IKEA-effect-by-sketchplanator/23563238.LVTDI'
	},
	{
		id: 'default-effect',
		title: 'Default effect',
		description: 'The power of the pre-selected option',
		imagePath: '/featured-prints/default-effect.jpg',
		redbubbleUrl: 'https://www.redbubble.com/i/poster/Default-effect-by-sketchplanator/23563240.LVTDI'
	}
];

// Piano music data - placeholder for Shopify integration
const PIANO_MUSIC = [
	{
		id: 'morning-sketches',
		title: 'Morning Sketches',
		description: 'A gentle piece inspired by early morning creativity',
		price: '$4.99',
		imagePath: '/piano-music/morning-sketches.jpg',
		shopifyUrl: '#'
	},
	{
		id: 'thinking-music',
		title: 'Thinking Music',
		description: 'Background music for deep work and concentration',
		price: '$4.99',
		imagePath: '/piano-music/thinking-music.jpg',
		shopifyUrl: '#'
	},
	{
		id: 'explanation-waltz',
		title: 'Explanation Waltz',
		description: 'A playful piece about the joy of understanding',
		price: '$4.99',
		imagePath: '/piano-music/explanation-waltz.jpg',
		shopifyUrl: '#'
	}
];

const ShopPage = () => {
	return (
		<Fragment>
			<Head>
				<title>{pageTitle('Shop Prints & Music')}</title>
				<meta 
					name="description" 
					content="High-quality prints of your favorite Sketchplanations, plus original piano sheet music from Jono Hey." 
				/>
				<meta property="og:title" content="Shop Prints & Music | Sketchplanations" />
				<meta 
					property="og:description" 
					content="Curated collection of the most popular Sketchplanations prints, plus original piano sheet music." 
				/>
			</Head>

			<div className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<section className="bg-white py-16">
					<div className="max-w-6xl mx-auto px-4 text-center">
						<TextHeader>Shop Prints & Music</TextHeader>
						<p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
							Curated collection of the most popular Sketchplanations prints, 
							plus original piano sheet music. Support the creator directly.
						</p>
					</div>
				</section>

				{/* Featured Prints */}
				<FeaturedPrintsSection prints={FEATURED_PRINTS} />

				{/* All Prints CTA */}
				<AllPrintsCTASection />

				{/* Piano Music Section */}
				<PianoMusicSection music={PIANO_MUSIC} />

				{/* Custom Commissions */}
				<CommissionsSection />
			</div>
		</Fragment>
	);
};

// Featured Prints Component
const FeaturedPrintsSection = ({ prints }) => (
	<section className="py-16 bg-white">
		<div className="max-w-6xl mx-auto px-4">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold text-gray-900 mb-4">
					Featured Prints
				</h2>
				<p className="text-lg text-gray-600">
					Our most popular Sketchplanations, perfect for your wall or as gifts
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{prints.map((print) => (
					<PrintCard key={print.id} print={print} />
				))}
			</div>
		</div>
	</section>
);

// Individual Print Card
const PrintCard = ({ print }) => {
	const { title, description, imagePath, redbubbleUrl } = print;
	
	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
			<div className="aspect-square bg-gray-100 relative">
				{/* Placeholder image with fallback */}
				<img
					src={imagePath}
					alt={title}
					className="w-full h-full object-contain"
					onError={(e) => {
						// Fallback to a placeholder if image doesn't exist
						e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZlYXR1cmVkIFByaW50PC90ZXh0Pjwvc3ZnPg==';
					}}
				/>
			</div>
			
			<div className="p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					{title}
				</h3>
				<p className="text-gray-600 text-sm mb-4">
					{description}
				</p>
				
				<a
					href={redbubbleUrl}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full justify-center"
					onClick={() => {
						track('Featured-print-click', { 
							sketch: title,
							location: 'shop-page'
						});
					}}
				>
					<Palette size={16} />
					Shop This Print
					<ExternalLink size={14} />
				</a>
			</div>
		</div>
	);
};

// All Prints CTA Section
const AllPrintsCTASection = () => (
	<section className="py-16 bg-gray-100">
		<div className="max-w-4xl mx-auto px-4 text-center">
			<h2 className="text-3xl font-bold text-gray-900 mb-6">
				Browse All Prints
			</h2>
			<p className="text-lg text-gray-600 mb-8">
				Explore our complete collection of over 150 prints available on 
				t-shirts, posters, mugs, and more. Find the perfect Sketchplanation 
				for every occasion.
			</p>
			
			<a
				href="https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling"
				target="_blank"
				rel="noreferrer"
				className="inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors duration-200"
				onClick={() => {
					track('View-all-prints', { location: 'shop-page' });
				}}
			>
				<Palette size={20} />
				View All Prints
				<ExternalLink size={16} />
			</a>
		</div>
	</section>
);

// Piano Music Section
const PianoMusicSection = ({ music }) => (
	<section className="py-16 bg-white">
		<div className="max-w-6xl mx-auto px-4">
			<div className="text-center mb-12">
				<h2 className="text-3xl font-bold text-gray-900 mb-4">
					Piano Sheet Music
				</h2>
				<p className="text-lg text-gray-600">
					Original compositions and arrangements by Jono Hey
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{music.map((piece) => (
					<MusicCard key={piece.id} piece={piece} />
				))}
			</div>

			<div className="text-center mt-12">
				<a
					href="https://your-shopify-store.com" // Replace with actual Shopify store URL
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200"
					onClick={() => {
						track('Piano-music-shop', { location: 'shop-page' });
					}}
				>
					<Music size={20} />
					Browse All Piano Music
					<ExternalLink size={16} />
				</a>
			</div>
		</div>
	</section>
);

// Individual Music Card
const MusicCard = ({ piece }) => {
	const { title, description, price, imagePath, shopifyUrl } = piece;
	
	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
			<div className="aspect-video bg-gray-100 relative">
				<img
					src={imagePath}
					alt={title}
					className="w-full h-full object-cover"
					onError={(e) => {
						// Fallback to a music note placeholder
						e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PGcgZmlsbD0iIzk5YTNhZiI+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTgwIiByPSIyMCIvPjxyZWN0IHg9IjIxOCIgeT0iODAiIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCIvPjx0ZXh0IHg9IjIwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGlhbm8gTXVzaWM8L3RleHQ+PC9nPjwvc3ZnPg==';
					}}
				/>
			</div>
			
			<div className="p-6">
				<div className="flex justify-between items-start mb-2">
					<h3 className="text-lg font-semibold text-gray-900">
						{title}
					</h3>
					<span className="text-lg font-bold text-green-600">
						{price}
					</span>
				</div>
				<p className="text-gray-600 text-sm mb-4">
					{description}
				</p>
				
				<a
					href={shopifyUrl}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 w-full justify-center"
					onClick={() => {
						track('Piano-music-click', { 
							piece: title,
							location: 'shop-page'
						});
					}}
				>
					<Music size={16} />
					Purchase Sheet Music
					<ExternalLink size={14} />
				</a>
			</div>
		</div>
	);
};

// Commissions Section
const CommissionsSection = () => (
	<section className="py-16 bg-gray-100">
		<div className="max-w-4xl mx-auto px-4 text-center">
			<h2 className="text-3xl font-bold text-gray-900 mb-6">
				Custom Sketch Commissions
			</h2>
			<p className="text-lg text-gray-600 mb-8">
				Want a custom Sketchplanation for your business, book, or personal project? 
				I create bespoke illustrations that explain your ideas clearly and beautifully.
			</p>
			
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-white p-6 rounded-lg">
					<h3 className="font-semibold mb-2">Business Concepts</h3>
					<p className="text-gray-600 text-sm">Explain complex ideas simply</p>
				</div>
				<div className="bg-white p-6 rounded-lg">
					<h3 className="font-semibold mb-2">Educational Content</h3>
					<p className="text-gray-600 text-sm">Make learning more engaging</p>
				</div>
				<div className="bg-white p-6 rounded-lg">
					<h3 className="font-semibold mb-2">Personal Projects</h3>
					<p className="text-gray-600 text-sm">Bring your ideas to life</p>
				</div>
			</div>
			
			<a
				href="mailto:hello@sketchplanations.com?subject=Custom Sketch Commission"
				className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
				onClick={() => {
					track('Commission-inquiry', { location: 'shop-page' });
				}}
			>
				<Mail size={20} />
				Inquire About Commissions
			</a>
		</div>
	</section>
);

export default ShopPage;