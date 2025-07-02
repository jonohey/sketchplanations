# Shop Page Strategy & Implementation Plan

## Current State Analysis

### Existing Setup
- **Framework**: Next.js with Prismic CMS integration
- **Current Shop Link**: Direct link to Redbubble in `components/Navigation.js`
- **Prints Field**: Individual sketches have a `redbubble_link_url` field managed in Prismic
- **User Flow**: Users click "Shop" → redirected to Redbubble site → potentially get lost

### Problems with Current Approach
1. **Loss of Control**: Users leave your site immediately, reducing brand engagement
2. **Poor Discovery**: Redbubble's algorithm may not showcase your best prints
3. **Mixed Messaging**: Redbubble promotes stickers/small items over quality prints
4. **No Piano Music Integration**: Shopify shop for piano music is completely separate
5. **Lost Analytics**: Can't track user behavior once they leave for Redbubble

## Strategic Recommendations

### 1. Shop Page Architecture

#### Primary Sections
1. **Hero Section**
   - Compelling headline: "Prints & Music from Sketchplanations"
   - Brief value proposition about quality and curation

2. **Featured Prints Gallery** 
   - 6-8 handpicked best-selling prints with high-quality thumbnails
   - Each print shows title, preview image, and "Shop This Print" CTA
   - Links to specific Redbubble product pages

3. **All Prints CTA**
   - Prominent section with "Browse All Prints" button
   - Links to your curated Redbubble storefront
   - Include messaging about variety and quality

4. **Piano Music Section**
   - Showcase latest/popular sheet music from Shopify
   - Integration with Shopify API or manual curation
   - Clear pricing and "Purchase Sheet Music" CTAs

5. **Custom Sketch Commissions**
   - Dedicated section for commission requests
   - Contact form or Stripe payment integration
   - Portfolio of past commissions

### 2. Technical Implementation Plan

#### Phase 1: Basic Shop Page (Week 1-2)
```javascript
// New file: pages/shop.js
import { useState } from 'react';
import Head from 'next/head';
import { track } from '@vercel/analytics';
import SketchplanationImage from 'components/SketchplanationImage';
import TextHeader from 'components/TextHeader';

const ShopPage = ({ featuredPrints, pianoMusic }) => {
  return (
    <>
      <Head>
        <title>Shop Prints & Music | Sketchplanations</title>
        <meta name="description" content="High-quality prints of your favorite Sketchplanations, plus piano sheet music from Jono Hey." />
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <TextHeader>Shop Prints & Music</TextHeader>
          <p className="text-lg text-gray-600 mt-4">
            Curated collection of the most popular Sketchplanations prints, 
            plus original piano sheet music
          </p>
        </section>

        {/* Featured Prints */}
        <FeaturedPrintsSection prints={featuredPrints} />
        
        {/* All Prints CTA */}
        <AllPrintsCTA />
        
        {/* Piano Music */}
        <PianoMusicSection music={pianoMusic} />
        
        {/* Custom Commissions */}
        <CommissionsSection />
      </div>
    </>
  );
};
```

#### Phase 2: Data Integration (Week 3)
1. **Prismic Schema Updates**
   - Add "featured_print" boolean field to sketchplanations
   - Create new "Piano Music" content type in Prismic
   - Add shop page content type for hero text/CTAs

2. **Shopify Integration**
   - Use Shopify Storefront API for piano music data
   - Create reusable hook: `hooks/useShopifyProducts.js`
   - Cache music data with SWR or React Query

#### Phase 3: Enhanced Features (Week 4)
1. **Search & Filtering**
   - Filter prints by category/theme
   - Search functionality for specific prints
2. **Social Proof**
   - Customer reviews/testimonials
   - "Most Popular" badges
3. **Email Capture**
   - Newsletter signup with print/music updates
   - Discount codes for email subscribers

### 3. Content Strategy

#### Featured Prints Curation Criteria
1. **High Sales Performance**: Use Redbubble analytics to identify top sellers
2. **Visual Appeal**: Prints that photograph well and showcase your style
3. **Broad Appeal**: Mix of topics (psychology, design, science, etc.)
4. **Print Quality**: Focus on designs that work well on physical products
5. **Seasonal Rotation**: Update quarterly to keep content fresh

#### Recommended Featured Prints (Initial Selection)
- Your most iconic/viral sketches
- Prints with broad appeal (productivity, psychology concepts)
- Seasonal favorites
- Recent popular additions
- Mix of color palettes and complexities

### 4. User Experience Best Practices

#### Landing Page Optimization
1. **Clear Value Proposition**
   - "Handpicked prints from 10+ years of Sketchplanations"
   - "Support the creator directly"

2. **Visual Hierarchy**
   - Large, high-quality print thumbnails
   - Clear pricing information
   - Prominent CTAs

3. **Trust Signals**
   - Customer testimonials
   - "Featured in..." publications
   - Return/quality guarantees

4. **Mobile Optimization**
   - Responsive grid layout
   - Touch-friendly buttons
   - Fast loading images

#### Conversion Optimization
1. **Multiple Purchase Paths**
   - Direct to specific products
   - Browse all options
   - Gift bundles/collections

2. **Urgency/Scarcity Elements**
   - "Limited edition" prints
   - "New arrivals" sections
   - Seasonal collections

3. **Social Proof**
   - "Customers also bought"
   - Review ratings
   - Social media integration

### 5. Analytics & Performance Tracking

#### Key Metrics to Monitor
1. **Engagement Metrics**
   - Time on shop page
   - Click-through rates to Redbubble
   - Scroll depth

2. **Conversion Metrics**
   - Shop page → Redbubble conversion rate
   - Email signups from shop page
   - Piano music purchases

3. **User Flow Analysis**
   - Entry points to shop page
   - Exit points and drop-offs
   - Popular print categories

#### Implementation
```javascript
// Enhanced analytics tracking
const trackShopInteraction = (action, details) => {
  track('Shop Interaction', {
    action,
    ...details,
    location: 'shop-page'
  });
};

// Usage examples:
onClick={() => trackShopInteraction('print-click', { printTitle: title })}
onClick={() => trackShopInteraction('view-all-prints')}
onClick={() => trackShopInteraction('music-purchase', { musicTitle: title })}
```

## Implementation Timeline

### Week 1: Planning & Design
- [ ] Finalize featured prints selection
- [ ] Create wireframes and mockups
- [ ] Set up Shopify API access
- [ ] Design component library

### Week 2: Core Development
- [ ] Create shop page structure
- [ ] Implement featured prints section
- [ ] Add all prints CTA section
- [ ] Update navigation component

### Week 3: Integration
- [ ] Connect Shopify API for piano music
- [ ] Add Prismic fields for featured prints
- [ ] Implement analytics tracking
- [ ] Mobile optimization

### Week 4: Enhancement & Launch
- [ ] Add search/filtering
- [ ] Implement email capture
- [ ] Performance optimization
- [ ] Launch and monitor

## Revenue Impact Projections

### Expected Improvements
1. **Better Print Discovery**: 25-40% increase in print sales due to curated presentation
2. **Increased Engagement**: Users spend more time on your site vs. immediate Redbubble redirect
3. **Cross-selling Opportunities**: Piano music exposure to print customers
4. **Brand Control**: Better storytelling and brand experience
5. **Data Collection**: Email list growth for future marketing

### Success Metrics (3-month targets)
- 30% increase in print-related revenue
- 15% increase in average session duration
- 500+ new email subscribers from shop page
- 10% increase in piano music sales through cross-promotion

## Recommended Next Steps

1. **Immediate (This Week)**
   - Audit current best-performing prints on Redbubble
   - Set up Shopify API access for piano music integration
   - Create initial wireframes

2. **Short-term (Next 2 Weeks)**
   - Begin development of shop page
   - Update Prismic schema for featured prints
   - Test analytics implementation

3. **Medium-term (Month 2)**
   - Launch beta version
   - A/B test different layouts
   - Collect user feedback

4. **Long-term (Months 3-6)**
   - Add commission request system
   - Implement print bundles/collections
   - Consider direct sales integration (Stripe + print-on-demand)

## Risk Mitigation

### Potential Challenges
1. **Redbubble Dependency**: Still relying on external platform
2. **Content Management**: Keeping featured prints updated
3. **Performance**: Loading multiple high-res images
4. **Mobile Experience**: Complex layout on small screens

### Solutions
1. **Progressive Enhancement**: Build with Redbubble as baseline, plan for future direct sales
2. **Automation**: Scripts to pull Redbubble performance data
3. **Optimization**: Implement lazy loading, WebP images, CDN
4. **Mobile-first Design**: Start with mobile layout, enhance for desktop

This strategy balances immediate improvements with long-term flexibility, giving you better control over the shopping experience while maintaining the benefits of Redbubble's fulfillment infrastructure.