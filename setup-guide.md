# Quick Setup Guide - Shop Page

## 1. Create Directory Structure

Create these folders in your `public` directory:

```
public/
├── featured-prints/
│   ├── survivorship-bias.jpg
│   ├── dunning-kruger.jpg
│   ├── two-minute-rule.jpg
│   ├── parkinson-law.jpg
│   ├── ikea-effect.jpg
│   └── default-effect.jpg
└── piano-music/
    ├── morning-sketches.jpg
    ├── thinking-music.jpg
    └── explanation-waltz.jpg
```

## 2. Add Placeholder Images (Optional)

For immediate testing, you can:

1. **Leave the folders empty** - The page includes fallback SVG placeholders that will show automatically if images are missing
2. **Add your actual sketch images** - Export your featured sketches as JPG files with the exact names above
3. **Use temporary placeholder images** - Any images with those names will work for testing

## 3. Update Navigation Component

Replace the Shop link in `components/Navigation.js`:

**Find this section (around lines 91-106):**
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

**Replace with:**
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

## 4. Test the Page

1. Run your development server: `npm run dev`
2. Navigate to `http://localhost:3000/shop`
3. You should see:
   - Hero section with title and description
   - Featured prints section (with placeholders if no images)
   - Browse all prints CTA (links to Redbubble)
   - Piano music section (placeholder)
   - Custom commissions section

## 5. Customize the Content

### Update Featured Prints
Edit the `FEATURED_PRINTS` array in `pages/shop.js` to include your actual best-selling prints:

```javascript
const FEATURED_PRINTS = [
	{
		id: 'your-sketch-id',
		title: 'Your Sketch Title',
		description: 'Brief description of what this sketch explains',
		imagePath: '/featured-prints/your-image.jpg',
		redbubbleUrl: 'https://www.redbubble.com/your-actual-product-url'
	},
	// ... add more prints
];
```

### Update Piano Music
Edit the `PIANO_MUSIC` array to include your actual Shopify products:

```javascript
const PIANO_MUSIC = [
	{
		id: 'your-music-id',
		title: 'Your Music Title',
		description: 'Description of the piece',
		price: '$X.XX',
		imagePath: '/piano-music/your-cover.jpg',
		shopifyUrl: 'https://your-shopify-store.com/products/your-music'
	},
	// ... add more pieces
];
```

### Update Contact Email
Change the commission inquiry email in the `CommissionsSection` component if needed.

## 6. Test Navigation

After updating the navigation component:
1. Click the "Shop" link in the main navigation
2. It should now take you to `/shop` instead of directly to Redbubble
3. The navigation should show the underline animation on the shop page

## What You'll See

- **Working page** with professional layout and styling
- **Placeholder images** that automatically show if real images aren't found
- **Functional buttons** that link to Redbubble and track analytics
- **Responsive design** that works on mobile and desktop
- **Commission inquiry** that opens the user's email client

## Next Steps

Once you see the basic page working:

1. **Add real images** for your featured prints
2. **Update the Redbubble URLs** to point to your actual products
3. **Add your Shopify store URL** for piano music
4. **Test analytics tracking** to ensure clicks are being recorded
5. **Customize styling** to match your brand better if needed

The page is designed to be immediately functional while allowing for easy customization and enhancement over time.