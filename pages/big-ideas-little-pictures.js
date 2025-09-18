import { track } from '@vercel/analytics'
import FancyLink from 'components/FancyLink'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { RoughNotation } from 'react-rough-notation'
import styles from './big-ideas-little-pictures.module.css'

import { pageTitle } from 'helpers'
import bigIdeasLittlePicturesCoverTransparentImage from 'images/big-ideas-little-pictures-cover-transparent.png'
import startingCompany from 'images/big-ideas-pages/big-ideas-book-spread-Starting-a-company.png'
import swissCheeseModel from 'images/big-ideas-pages/big-ideas-book-spread-Swiss-cheese-model.png'
import tsundoku from 'images/big-ideas-pages/big-ideas-book-spread-Tsundoku.png'
import coastlineParadox from 'images/big-ideas-pages/big-ideas-book-spread-coastline-paradox.png'

// Store links organized by country
const storeLinks = {
  US: [
    { href: 'https://amzn.to/455q8Qp', label: 'Amazon.com' },
    { href: 'https://www.barnesandnoble.com/w/big-ideas-little-pictures-jono-hey/1143331058?ean=9781956403572', label: 'Barnes & Noble' },
    { href: 'https://bookshop.org/p/books/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-time-jono-hey/19990252', label: 'Bookshop.org' },
    { href: 'https://www.target.com/p/big-ideas-little-pictures-by-jono-hey-hardcover/-/A-89029770', label: 'Target' },
    { href: 'https://www.booksamillion.com/p/Big-Ideas-Little-Pictures/Jono-Hey/9781956403572?id=8965300189654', label: 'Books A Million' },
  ],
  GB: [
    { href: 'https://amzn.to/3tsd3lF', label: 'Amazon UK' },
    { href: 'https://blackwells.co.uk/bookshop/product/Big-Ideas-Little-Pictures-by-Jono-Hey/9781956403572', label: 'Blackwells'},
    { href: 'https://www.waterstones.com/book/big-ideas-little-pictures/jono-hey/9781956403572', label: 'Waterstones' },
    { href: 'https://www.foyles.co.uk/book/big-ideas-little-pictures/jono-hey/9781956403572', label: 'Foyles'},
  ],
}

const otherStores = {
  AU: [
	{ href: 'https://amzn.to/4cVgP7I', label: 'Australia (Amazon)'},
	{ href: 'https://www.booktopia.com.au/big-ideas-little-pictures-jono-hey/book/9781956403572.html', label: 'Australia (Booktopia)'},
	{ href: 'https://www.dymocks.com.au/big-ideas-little-pictures-by-jono-hey-9781956403572', label: 'Australia (Dymocks)'},
	{ href: 'https://www.thenile.com.au/books/jono-hey/big-ideas-little-pictures/9781956403572', label: 'Australia (The Nile)'},
	{ href: 'https://www.readings.com.au/product/9781956403572/big-ideas-little-pictures--jono-hey--2024--9781956403572', label: 'Australia (Readings)'},
  ],
  BE: { href: 'https://www.amazon.com.be/-/en/Jono-Hey/dp/1956403574/ref=sr_1_4', label: 'Belgium' },
  BR: { href: 'https://www.amazon.com.br/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Brazil' },
  CA: [
    { href: 'https://amzn.to/3WnM6uQ', label: 'Canada (Amazon)' },
    { href: 'https://www.indigo.ca/en-ca/big-ideas-little-pictures-explaining-the-world-one-sketch-at-a-time/9781956403572.html', label: 'Canada (Indigo)' },
  ],
  CN: { href: 'https://3.cn/1Zj-dhXh', label: 'China (JD)' },
  FR: { href: 'https://www.amazon.fr/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'France' },
  DE: { href: 'https://www.amazon.de/-/en/Jono-Hey/dp/1956403574/ref=sr_1_1', label: 'Germany' },
  IN: { href: 'https://www.amazon.in/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'India' },
  IT: { href: 'https://www.amazon.it/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Italy' },
  MX: { href: 'https://www.amazon.com.mx/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Mexico' },
  NL: { href: 'https://www.amazon.nl/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Netherlands' },
  NZ: { href: 'https://www.mightyape.co.nz/product/big-ideas-little-pictures-hardback/36769294', label: 'New Zealand (Mighty Ape)' },
  PL: { href: 'https://www.amazon.pl/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Poland' },
  SA: { href: 'https://www.amazon.sa/Jono-Hey/dp/1956403574/ref=sr_1_1', label: 'Saudi Arabia' },
  SG: { href: 'https://www.amazon.sg/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Singapore' },
  ZA: [
	{ href: 'https://www.amazon.co.za/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'South Africa (Amazon)' },
	{ href: 'https://www.takealot.com/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-/PLID92989211', label: 'South Africa (Takealot)' },
  ],
  ES: { href: 'https://www.amazon.es/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Spain' },
  SE: { href: 'https://www.amazon.se/Big-Ideas-Little-Pictures-Explaining/dp/1956403574/ref=sr_1_1', label: 'Sweden' },
  CH: {
    href: 'https://www.exlibris.ch/de/buecher-buch/english-books/jono-hey/big-ideas-little-pictures/id/9781956403572/',
    label: 'Switzerland (Ex Libris)',
  },
}

const OrderLink = ({ href, children }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    className='btn-outline'
    aria-label={`Order from ${children}`}
    onClick={() => {
      track('Book-store-link', { location: children })
    }}
  >
    {children}
  </a>
)

export async function getServerSideProps({ req }) {
  const country = req.headers['x-country'] || 'BOTH'
  return {
    props: { country },
  }
}

const Book = ({ country }) => {
  const [showAllStores, setShowAllStores] = useState(false)
  
  return (
    <>
      <Head>
        <title>{pageTitle('Big Ideas Little Pictures by Jono Hey')}</title>
        <meta
          name='description'
          content="Discover Big Ideas, Little Pictures by Jono Hey—a delightful book that simplifies complex ideas with clear illustrations. Explore reviews, FAQs, see what's inside, and order your copy."
        />
        <link rel='canonical' href='https://sketchplanations.com/big-ideas-little-pictures' />
        <link rel="preconnect" href="https://www.youtube.com" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Big Ideas Little Pictures by Jono Hey" />
        <meta property="og:description" content="A delightful book that simplifies complex ideas with clear illustrations. Over 130 inspiring, funny and relatable sketches about life." />
        <meta property="og:image" content="https://sketchplanations.com/images/big-ideas-little-pictures-book-thumbnail-1200x630.png" />
        <meta property="og:url" content="https://sketchplanations.com/big-ideas-little-pictures" />
        <meta property="og:site_name" content="Sketchplanations" />
        <meta property="og:type" content="product" />

        {/* Additional Open Graph properties */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_GB" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:secure_url" content="https://sketchplanations.com/images/big-ideas-little-pictures-book-thumbnail-1200x630.png" />
        <meta property="og:image:alt" content="Big Ideas Little Pictures book cover" />
        <meta property="og:price:amount" content="18.99" />
        <meta property="og:price:currency" content="USD" />
        <meta property="og:availability" content="in stock" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sketchplanator" />
        <meta name="twitter:title" content="Big Ideas Little Pictures by Jono Hey" />
        <meta name="twitter:description" content="A delightful book that simplifies complex ideas with clear illustrations. Over 130 inspiring, funny and relatable sketches about life." />
        <meta name="twitter:image" content="https://sketchplanations.com/images/big-ideas-little-pictures-book-thumbnail-1200x630.png" />
        <meta name="twitter:image:alt" content="Big Ideas Little Pictures book cover" />

        {/* Additional Twitter properties */}
        <meta name="twitter:creator" content="@sketchplanator" />
        <meta name="twitter:app:name:iphone" content="Sketchplanations" />
        <meta name="twitter:app:name:ipad" content="Sketchplanations" />

        {/* Additional meta tags for better SEO */}
        <meta name="keywords" content="book, sketches, illustrations, big ideas, little pictures, jono hey, sketchplanations" />
        <meta name="author" content="Jono Hey" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Big Ideas Little Pictures",
              "description": "A delightful book that simplifies complex ideas with clear illustrations. Over 130 inspiring, funny and relatable sketches about life.",
              "image": "https://sketchplanations.com/images/big-ideas-little-pictures-book-thumbnail-1200x630.png",
              "isbn": "978-1956403572",
              "author": {
                "@type": "Person",
                "name": "Jono Hey"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Media Lab Books"
              },
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "18.99",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "bestRating": "5",
                "ratingCount": 140,
                "reviewCount": 140
              },
              "review": {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Bill Gates"
                },
                "reviewBody": "This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too."
              }
            })
          }}
        />
      </Head>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert'>
        <div className='py-12'>
          <div id='hero' className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='w-full md:w-1/2'>
              <div className='text-center'>
                <Image
                  src={bigIdeasLittlePicturesCoverTransparentImage}
                  alt='Big Ideas Little Pictures by Jono Hey'
                  priority
                  placeholder='blur'
                  className='mx-auto'
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  quality={75}
                  width={600}
                  height={800}
                />
                <div className='flex justify-center mt-4'>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className='text-yellow-400 text-2xl'>
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <blockquote className='text-lg md:text-xl mb-4 font-medium'>
                <p className='mb-4'>
                  &quot;This is such a cool book.
                </p>
                <p className='mb-4'>
                  The range of Jono&apos;s knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings.
                </p>
                <p className='mb-4'>
                  You&apos;ll learn something on every page—and be entertained too.&quot;
                </p>
              </blockquote>
              <cite className={`text-gray-800 dark:text-gray-200 block text-2xl font-semibold ${styles.cite}`}>— Bill Gates</cite>
            </div>
          </div>

          <div id='intro' className='text-center mt-12 max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-2'>Big Ideas Little Pictures</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>Explaining the world one sketch at a time</p>
            <p className='text-lg leading-relaxed'>
              Sketchplanations in a book! And <span aria-hidden="true">✨</span> news flash <span aria-hidden="true">✨</span> now an eBook too! In this 288-page collection, Jono Hey collects together over 130
              inspiring, funny and relatable sketches about life. Combining existing and new topics, Big Ideas Little
              Pictures is a perfect gift of the wisdom and joy of Sketchplanations. Pop it on the table and start having great conversations about ideas.
            </p>
          </div>

          <div id='order' className='mt-24 max-w-3xl mx-auto scroll-mt-24'>
            <h2 className='text-3xl font-bold mb-8 text-center'>Order Big Ideas Little Pictures</h2>
            <div className='space-y-12'>
              {/* User's country section (if not US/UK) */}
              {country !== 'US' && country !== 'GB' && otherStores[country] && (
                <div className='text-center'>
                  <h3 className='text-xl font-semibold mb-4'>Order in your region</h3>
                  <div className='flex flex-wrap gap-4 justify-center'>
                    {Array.isArray(otherStores[country]) ? (
                      otherStores[country].map((store) => (
                        <OrderLink key={store.label} href={store.href}>
                          {store.label}
                        </OrderLink>
                      ))
                    ) : (
                      <OrderLink href={otherStores[country].href}>
                        {otherStores[country].label}
                      </OrderLink>
                    )}
                  </div>
                </div>
              )}

              {/* US Section */}
              <div className='text-center'>
                <h3 className='text-xl font-semibold mb-4'>United States</h3>
                <div className='flex flex-wrap gap-4 justify-center'>
                  {storeLinks.US.map((store) => (
                    <OrderLink key={store.label} href={store.href}>
                      {store.label}
                    </OrderLink>
                  ))}
                </div>
              </div>

              {/* UK Section */}
              <div className='text-center'>
                <h3 className='text-xl font-semibold mb-4'>United Kingdom</h3>
                <div className='flex flex-wrap gap-4 justify-center'>
                  {storeLinks.GB.map((store) => (
                    <OrderLink key={store.label} href={store.href}>
                      {store.label}
                    </OrderLink>
                  ))}
                </div>
              </div>

              {/* Other regions section */}
              {!showAllStores ? (
                <div className='text-center mt-8'>
                  <button
                    type="button"
                    onClick={() => setShowAllStores(true)}
                    className='text-blue hover:underline font-medium'
                    aria-expanded={showAllStores}
                    aria-controls="other-regions-stores"
                  >
                    Show stores in more regions →
                  </button>
                </div>
              ) : (
                <>
                  <div className='text-center'>
                    <h3 className='text-xl font-semibold mb-4'>Worldwide</h3>
                    <div id="other-regions-stores" className='flex flex-wrap gap-4 justify-center'>
                      {Object.entries(otherStores).map(([countryCode, store]) => (
                        countryCode !== country && (
                          Array.isArray(store) ? (
                            store.map((s) => (
                              <OrderLink key={s.label} href={s.href}>
                                {s.label}
                              </OrderLink>
                            ))
                          ) : (
                            <OrderLink key={store.label} href={store.href}>
                              {store.label}
                            </OrderLink>
                          )
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div className='text-center mt-8'>
                    <button
                      type="button"
                      onClick={() => setShowAllStores(false)}
                      className='text-blue hover:underline font-medium'
                      aria-expanded={showAllStores}
                      aria-controls="other-regions-stores"
                    >
                      Show fewer stores ↑
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className='mx-auto text-center'>
              <p className='mt-8'>
                <Link 
                  href='https://www.kensingtonbooks.co.uk/product-page/big-ideas-little-pictures?utm_source=sketchplanations&utm_medium=website&utm_campaign=book_page&utm_content=signed_copy'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Order a signed copy of Big Ideas Little Pictures'
                  onClick={() => {
                    track('Book-store-link', { location: 'Signed copy' })
                  }}
                >
                  Order an exclusive <RoughNotation type="circle" show={true} color="var(--color-brightRed)">signed copy</RoughNotation>
                </Link>
                <br/>
                from my friends at South Kensington Books in London
              </p>
              <p className='mt-8'>
                Or order from your local bookshop because we 💙 them.
              </p>
              <p className='text-sm mt-8'>
                Notwithstanding, I earn from qualifying purchases through the Amazon Associates program if you use the Amazon links on this site, which helps me out if you are planning to buy from Amazon.
              </p>
            </div>
          </div>

          <div id='whats-inside' className='mt-24 max-w-3xl mx-auto scroll-mt-24'>
            <h2 className='text-3xl font-bold mb-4 text-center'>What Will You Find Inside?</h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 mb-12 text-center'>
              10 sections, 130+ ideas
            </p>

            <p className='text-lg mb-6'>
              <strong>Big Ideas Little Pictures</strong> brings together over 130 sketches across science, psychology, nature, technology, and everyday life. Here&apos;s a glimpse of what you&apos;ll find inside:
            </p>

            {/* Table of Contents Excerpt */}
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16'>
              <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                <h3 className='text-2xl font-bold mb-6 text-center'>Table of Contents</h3>
                <p>Sections of the book with a few sample sketches for each.</p>
                <div className='max-w-none'>
                  
                  <ol className={styles.tocGrid}>
                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Nature&apos;s Nuances</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Coastline Paradox, Autumn Leaves, The Golden Ratio, The Golden Ratio, The Moon Illusion</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Health and Healing</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Swiss Cheese Model, Microadventures, The Three-Day Effect, Sleep Basics</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>There&apos;s a Word for That</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Schadenfreude, Emotional Hot Potato, Tsundoku, Yak shaving</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Motivation and Inspiration</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Road to Success, Motivation Doesn&apos;t Last, 9,000 shots, Sleeping with a Mosquito</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Blind Spots</h4>
                      <p className={styles.tocDescription}><i>Including:</i> You Get What You Measure, The Paradox of Choice, The Spotlight Effect, Chesterton&apos;s Fence</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Starry-Eyed Surprises</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Atmospheric Perspective, Phases of the Moon, Know Your Clouds, The Potato Radius</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Business and Bytes</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Traveling Salesman Problem, Starting a Company, The Trust Equation, The Long Nose of Innovation</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Thinking About Thinking</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Thesis, Antithesis, Synthesis, Solvitur Ambulando, The BS Asymmetry Principle, The 20/40/60 Rule</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>The Big Picture</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Solar System Sizes, The Overview Effect, The Continental Axis Hypothesis, 1.5 Billion Heartbeats</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Life&apos;s Little Manuals</h4>
                      <p className={styles.tocDescription}><i>Including:</i> How to Win at Monopoly, Skip Rocks Like a Pro, The 60-30-10 Color Rule, The Awkwardness Vortex</p>
                    </li>
                  </ol>

                  <p className='mt-6 '>
                    …and many more.
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery in What's Inside section */}
            <h3 id ='sample-pages' className='text-2xl font-bold text-center'>Sample pages</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 mb-16'>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={coastlineParadox}
                  alt='The Coastline Paradox - How the length of a coastline depends on how you measure it'
                  fill
                  className='object-contain rounded-lg'
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={tsundoku}
                  alt='Tsundoku - The act of acquiring books and letting them pile up without reading them'
                  fill
                  className='object-contain rounded-lg'
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={swissCheeseModel}
                  alt='The Swiss Cheese Model - For understanding accidents and improving safety'
                  fill
                  className='object-contain rounded-lg'
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={startingCompany}
                  alt='Starting a Company - Is like jumping off a cliff and assembling the plane on the way down'
                  fill
                  className='object-contain rounded-lg'
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                />
              </div>
            </div>

            {/* Videos stacked vertically */}
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='space-y-8'>
                <div className={styles.youtube_container}>
                  <iframe
                    src='https://www.youtube.com/embed/dQqP6aBLHYc?si=oogeEYEXru3cs53s&controls=0&rel=0'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <div className={styles.youtube_container}>
                  <iframe
                    src='https://www.youtube.com/embed/1NQqM5ZjR2g?si=BOQLpNP4RDwVLnQ4'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div id='praise' className='mt-24'>
            <h2 className='text-3xl font-bold mb-12 text-center'>Praise for Big Ideas Little Pictures</h2>

            <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Bill Gates Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;This is such a cool book. The range of Jono&apos;s knowledge is astounding, and so is his
                    ability to digest complex ideas into deceptively simple drawings. You&apos;ll learn something on
                    every page—and be entertained too.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <cite className={`${styles.cite} font-semibold`}>Bill Gates</cite>
                  </div>
                </div>

                {/* Dan Roam Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    <p>
                      As the world becomes more complex and fraught, the more we need clear and honest pictures to
                      show us a better way. In his marvellous book, <i>Big Ideas, Little Pictures</i>, Jono Hey gives
                      us the pictures we need.
                    </p>
                    <p>
                      Whether exploring the size of the universe, unpacking the paradox of
                      choice, or illuminating the pure joy of the Golden Ratio, Jono&apos;s brilliant sketches make
                      everything make more sense.
                    </p>
                    <p>
                      I can&apos;t think of a better gift for my mind, and yours.
                    </p>
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Dan Roam</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        International bestselling author of The Back of the Napkin, and Draw To Win
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mike Rohde Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;Big Ideas, Little Pictures is a magical collection of ideas, concepts, and wisdom—some that
                    I&apos;ve wondered about and others I&apos;ve never thought about before—presented in a clear
                    visual way that makes Jono&apos;s sketchplanations a joy to read, reference, and share. It&apos;s a
                    fantastic book!&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Mike Rohde</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Bestselling author of The Sketchnote Handbook and illustrator of REWORK
                      </div>
                    </div>
                  </div>
                </div>

                {/* Katy Milkman Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;I&apos;m an enormous fan of the wonderful way Jono&apos;s sketches bring scientific insights
                    to life for a wide audience.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Katy Milkman</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Professor at the Wharton School of the University of Pennsylvania and author of the
                        international bestseller How to Change
                      </div>
                    </div>
                  </div>
                </div>

                {/* Richard Shotton Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;Brilliant! It distills a variety of complex and profound ideas into simple to understand and
                    beautifully drawn sketches.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Richard Shotton</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>Author of The Choice Factory</div>
                    </div>
                  </div>
                </div>

                {/* Brendan Leonard Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;Jono Hey&apos;s Big Ideas Little Pictures is the kind of book that I want to devour all at
                    once, with his brilliantly efficient illustrations breaking down complex ideas—but that I make
                    myself ration to a few pages per day, to give myself time to absorb everything. Either way,
                    it&apos;s the best bet I have to make myself seem more interesting as a dinner party guest.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Brendan Leonard</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Creator at Semi-rad and author of Make It: 50 Myths and Truths About Creating
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mark Frauenfelder Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;Jono&apos;s superpower is the ability to break down complex concepts into digestible, visually
                    appealing explanations.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Mark Frauenfelder</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Founder of Boing Boing, Recomendo, Make and Wired magazines
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trenton Moss Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;I&apos;ve loved following Sketchplanations for years. And finally, Jono has brought it all
                    together in this wonderful book. Keep a copy in your home and show it to everyone who comes
                    over.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Trenton Moss</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Bestselling author of Human Powered and Founder of Team Sterka
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jason Barron Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;Jono&apos;s delightful book is a fantastic blend of text and visuals, making the topics easy
                    to understand and remember. I found myself eager to turn each page, learning things I had never
                    known before. I love this book and recommend it to anyone looking to enrich their knowledge at super
                    speed with some creativity and fun.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Jason Barron</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>Author of The Visual MBA</div>
                    </div>
                  </div>
                </div>

                {/* Gillian Cross Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    <p>
                      &quot;I love this book. It will delight adults, fascinate children and help us all to grasp
                      important ideas.
                    </p>
                    <p>Want to understand the four horsemen of relationship apocalypse? Or different types
                      of phishing? Or the ten essentials for wilderness safety? Jono Hey&apos;s explanations are brief and
                      clear – but it&apos;s his pictures that stick in your head. Every time you turn over a page,
                      there&apos;s something new. I can&apos;t wait to try out the instructions for skipping rocks like a
                      pro and taking better photographs—and I&apos;ll certainly take up the Dracula sneeze.
                    </p>
                    <p>
                      I meant to read it slowly, a few pages at a time, but it&apos;s such fun that I kept thinking,
                      Just one more picture and finished it in one sitting. I&apos;m looking forward to re-reading it very
                      soon.&quot;
                    </p>
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Gillian Cross</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>Multi-award-winning children&apos;s book author</div>
                    </div>
                  </div>
                </div>

                {/* Eva-Lotta Lamm Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    <p>
                      &quot;<i>Big Ideas, Little Pictures</i> by Jono Hey is a beautiful and powerful book at the
                      same time. On each page, Jono visualises a complex concept into a clear, engaging little drawing.
                      His sketches don&apos;t just simplify ideas, they bring them to life and make them understandable at
                      a glance.
                    </p>
                    <p>
                      This large collection of concepts, scientific findings and interesting frameworks is
                      delightful and a real testament to the power of communicating through simple visuals. This body of
                      work is even more impressive as it was created by Jono over years of drawing one concept per week.
                    </p>
                    <p>
                      As a fellow visual thinker I&apos;m in love with this wonderful book. It&apos;s a joy to dive in at
                      any page, to get drawn in by the pictures and to learn a new fact with every turn of the page.&quot;
                    </p>
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <cite className={`${styles.cite} font-semibold block`}>Eva-Lotta Lamm</cite>
                      <div className='text-sm text-gray-600 dark:text-gray-300'>Designer and Visual Thinker</div>
                    </div>
                  </div>
                </div>

                {/* Dad Quote */}
                <div className='bg-gray-50 dark:bg-gray-800 p-8 rounded-lg'>
                  <blockquote className={`text-base mb-6 ${styles.blockquote}`}>
                    &quot;I resent our bedroom looking so messy in the <FancyLink href='/tsundoku' aria-label='Learn more about Tsundoku'>tsundoku</FancyLink> sketch.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <cite className={`${styles.cite} font-semibold`}>Dad</cite>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id='faq' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold mb-8 text-center'>FAQ</h2>
            <div className='space-y-8 max-w-none'>
              <div>
                <h3>Can I order in a different country?</h3>
                <p>
                  Please contact me at{' '}
                  <FancyLink 
                    href='mailto:jono.hey@gmail.com'
                    aria-label='Email Jono Hey'
                  >
                    jono.hey@gmail.com
                  </FancyLink>{' '}
                  and let me know where you are. It helps us get distribution in the right places first.
                </p>
              </div>

              <div>
                <h3>Is there an eBook version?</h3>
                <p>
                  Yes! As of May 2025 there&apos;s now an eBook of Big Ideas Little Pictures.
                </p>
                <p>
                  It&apos;s great for quick reference, easier to carry on your commute or a flight, and a decent amount cheaper. It&apos;s packed with nearly 150 bite-sized sketches—perfect for dipping in when you need an idea, a shift in perspective, or a smile.
                </p>
                <p>You can buy it on the <FancyLink 
                    href='#order'
                    aria-label='Buy the eBook of Big Ideas Little Pictures'
                  >store links above</FancyLink>, or find it on B&N, Apple Books, Kobo, and others.
                </p>
              </div>

              <div>
                <h3>Do you have photos or images I can use to share?</h3>
                <p>
                  Yes. Please use images in the{' '}
                  <FancyLink 
                    href='https://drive.google.com/drive/folders/1QFZrtmseJO9kbH3NLwIq9RPaxeKd7Hb3?usp=sharing' 
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Access the basic media kit on Google Drive'
                  >
                    basic media kit
                  </FancyLink>
                  . Let me know if it&apos;s missing something.
                </p>
              </div>

              <div>
                <h3>Is it available in other languages?</h3>
                <p>
                  Not yet. Do let me know if you&apos;d like it in another language—it always helps to gauge demand.
                </p>
              </div>

              <div>
                <h3>What is the ISBN for Big Ideas Little Pictures?</h3>
                <p>The ISBN-13 is 978-1956403572</p>
                <p>ISBN-10 is 1956403574</p>
              </div>

              <div>
                <h3>What&apos;s the picture on the cover?</h3>
                <p>
                  The picture is my own version of Hokusai&apos;s remarkable <i>The Great Wave off
                  Kanagawa</i> or just the <i>Great Wave</i>. I once saw
                  the real thing at the British Museum in London. It&apos;s small, but few pictures captivate the way it
                  does. <FancyLink 
                    href='https://kottke.org/24/05/the-evolution-of-hokusais-great-wave'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Read about how Hokusais wave evolved throughout his life'
                  >Hokusai&apos;s wave evolved a lot throughout his life</FancyLink>.
                </p>
                <p>
                  <FancyLink 
                    href='https://www.redbubble.com/shop/ap/162403242?asc=u'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Buy a print of the Sketchplanations Wave on Redbubble'
                  >
                    Buy a print of the Sketchplanations Wave
                  </FancyLink>
                </p>
              </div>

              <div>
                <h3>Got another question? Please contact me</h3>
                <p>
                  I&apos;m at:{' '}
                  <FancyLink 
                    href='mailto:jono.hey@gmail.com'
                    aria-label='Email Jono Hey'
                  >
                    jono.hey@gmail.com
                  </FancyLink>
                </p>
              </div>
            </div>
          </div>

          <div id='why' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold mb-8'>Why a book?</h2>
            <div className='space-y-6'>
              <p>
                I started making sketchplanations in 2013 by sketching them in actual books. While putting the sketches
                online has helped them reach so many more people there&apos;s something about browsing through the
                sketches in a book, phones and laptops away, that makes it the best way to experience it.
              </p>
              <p>
                Which sketches to include was a challenge. I&apos;m really happy that I&apos;ve selected sketches that
                will teach you a new thing or two about the world, make you think, inspire you and make you smile. In
                the process, I added a host of sketches for topics I&apos;d always wanted to cover ranging from How to
                Win at Monopoly to the Basics of a Good Night&apos;s Sleep.
              </p>
            </div>
          </div>

          <div className='mt-24 text-center'>
            <Link 
              href='#order'
              className='btn-primary inline-block px-12 py-3 text-lg'
            >
              Order Book
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Book
