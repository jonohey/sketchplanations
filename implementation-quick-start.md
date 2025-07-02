# Quick Start Implementation Guide

## Step 1: Update Navigation Component

First, let's update the Navigation component to link to your new shop page instead of directly to Redbubble:

### Current Code (components/Navigation.js - lines 91-106):
```javascript
<a
	href="https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling"
	target="_blank"
	rel="noreferrer"
	className={styles.item}
	onClick={() => {
		track('Shop', { location: 'header' });
	}}
>
	<span className="inline-flex items-center gap-2">
		<span>Shop</span>
		<ExternalLink size={16} className="inline" />
	</span>
</a>
```

### Updated Code:
```javascript
<Link
	href="/shop"
	className={styles.item}
	aria-current={isSelected("/shop") ? "page" : undefined}
	onClick={() => {
		track('Shop-page-link', { location: 'header' });
	}}
>
	<RoughNotation show={isSelected("/shop")} {...roughNotationProps}>
		Shop
	</RoughNotation>
</Link>
```

## Step 2: Create Basic Shop Page

Create a new file `pages/shop.js`:

```javascript
import { Fragment } from 'react';
import Head from 'next/head';
import { track } from '@vercel/analytics';
import { client } from 'services/prismic';
import { pageTitle } from 'helpers';
import TextHeader from 'components/TextHeader';
import SketchplanationImage from 'components/SketchplanationImage';
import { ExternalLink, Music, Palette, Mail } from 'lucide-react';

const ShopPage = ({ featuredPrints, shopData }) => {
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
				<FeaturedPrintsSection prints={featuredPrints} />

				{/* All Prints CTA */}
				<AllPrintsCTASection />

				{/* Piano Music Section */}
				<PianoMusicSection />

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
					<PrintCard key={print.uid} print={print} />
				))}
			</div>
		</div>
	</section>
);

// Individual Print Card
const PrintCard = ({ print }) => {
	const { data: { title, image, redbubble_link_url } } = print;
	
	return (
		<div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
			<div className="aspect-square bg-gray-100">
				<SketchplanationImage
					image={image}
					title={title}
					className="w-full h-full object-contain"
				/>
			</div>
			
			<div className="p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-3">
					{title}
				</h3>
				
				{redbubble_link_url && (
					<a
						href={redbubble_link_url}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
				)}
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
const PianoMusicSection = () => (
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
				{/* Placeholder for now - will integrate with Shopify API */}
				<div className="bg-gray-50 rounded-lg p-8 text-center">
					<Music size={48} className="mx-auto text-gray-400 mb-4" />
					<h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
					<p className="text-gray-600">
						Piano sheet music integration with Shopify coming soon
					</p>
				</div>
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
					Browse Piano Music
					<ExternalLink size={16} />
				</a>
			</div>
		</div>
	</section>
);

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

// Server-side data fetching
export async function getStaticProps() {
	// Get featured prints (sketches marked as featured)
	const featuredPrints = await client.getByType('sketchplanation', {
		filters: [
			// For now, get the 6 most recent sketches with redbubble links
			// Later, add a "featured_print" field in Prismic
		],
		pageSize: 6,
		orderings: [
			{
				field: 'my.sketchplanation.published_at',
				direction: 'desc'
			}
		]
	});

	// Filter to only include sketches with redbubble links
	const printsWithLinks = featuredPrints.results.filter(
		sketch => sketch.data.redbubble_link_url
	);

	return {
		props: {
			featuredPrints: printsWithLinks.slice(0, 6),
		},
		revalidate: 3600, // Revalidate every hour
	};
}

export default ShopPage;
```

## Step 3: Update Navigation Import

In `components/Navigation.js`, make sure you have the Link component imported correctly:

```javascript
// At the top of the file, make sure you have:
import Link from "./Link"; // Your custom Link component
```

## Step 4: Test the Implementation

1. Start your development server: `npm run dev`
2. Navigate to `/shop` to see your new page
3. Click the Shop link in the navigation to ensure it works
4. Check that analytics tracking is working

## Next Steps

1. **Add CSS Styling**: The components above use Tailwind classes, but you may want to create custom CSS modules for better integration with your existing design system.

2. **Prismic Integration**: Add a `featured_print` boolean field to your Sketchplanation content type in Prismic to mark which prints should appear on the shop page.

3. **Shopify Integration**: Set up the Shopify Storefront API to pull in your piano music products.

4. **Enhanced Analytics**: Add more detailed tracking for user interactions.

5. **Mobile Optimization**: Test and refine the mobile experience.

## Quick Wins

- **Immediate**: Replace direct Redbubble link with curated experience
- **Week 1**: Launch basic shop page with featured prints
- **Week 2**: Add Shopify integration for piano music
- **Week 3**: Implement advanced features (email capture, better filtering)

This approach gives you an immediate improvement while laying the foundation for more advanced features.