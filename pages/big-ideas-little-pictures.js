import { track } from '@vercel/analytics'
import FancyLink from 'components/FancyLink'
import ImageGallery from 'components/ImageGallery'
import JsonLd from 'components/JsonLd'
import ReaderQuotes from 'components/ReaderQuotes'
import { pageTitle } from 'helpers'
import { BOOK_REVIEWS } from 'helpers/bookReviews'
import { buildBookProductGraph } from 'helpers/structuredData'
import bigIdeasLittlePicturesCoverImage from 'images/big-ideas-little-pictures-book-cover.jpg'
import Book3D from 'components/Book3D'
import { ZoomIn } from 'lucide-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { bookPageImages } from 'utils/bookImages.mjs'
import styles from './big-ideas-little-pictures.module.css'

const AMAZON_LINK = 'https://geni.us/big-ideas-book'
const GOODREADS_LINK = 'https://www.goodreads.com/book/show/127280527-big-ideas-little-pictures'

const BOOK_REVIEWS_ICON = {
  src: '/images/explainer-kit/sketch-icons/Book stack.svg',
  width: 385,
  height: 432,
}

// Non-Amazon retailers by region, sorted by click volume within each region
const regionalStores = {
  US: [
    { href: 'https://bookshop.org/p/books/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-time-jono-hey/19990252', label: 'Bookshop.org' },
    { href: 'https://www.barnesandnoble.com/w/big-ideas-little-pictures-jono-hey/1143331058?ean=9781956403572', label: 'Barnes & Noble' },
    { href: 'https://www.booksamillion.com/p/Big-Ideas-Little-Pictures/Jono-Hey/9781956403572?id=8965300189654', label: 'Books A Million' },
    { href: 'https://www.target.com/p/big-ideas-little-pictures-by-jono-hey-hardcover/-/A-89029770', label: 'Target' },
  ],
  GB: [
    { href: 'https://www.waterstones.com/book/big-ideas-little-pictures/jono-hey/9781956403572', label: 'Waterstones' },
    { href: 'https://blackwells.co.uk/bookshop/product/Big-Ideas-Little-Pictures-by-Jono-Hey/9781956403572', label: 'Blackwells' },
    { href: 'https://www.foyles.co.uk/book/big-ideas-little-pictures/jono-hey/9781956403572', label: 'Foyles' },
  ],
  AU: [
    { href: 'https://www.booktopia.com.au/big-ideas-little-pictures-jono-hey/book/9781956403572.html', label: 'Australia (Booktopia)' },
    { href: 'https://www.dymocks.com.au/big-ideas-little-pictures-by-jono-hey-9781956403572', label: 'Australia (Dymocks)' },
  ],
  CA: [
    { href: 'https://www.indigo.ca/en-ca/big-ideas-little-pictures-explaining-the-world-one-sketch-at-a-time/9781956403572.html', label: 'Canada (Indigo)' },
  ],
  CH: [
    { href: 'https://www.exlibris.ch/de/buecher-buch/english-books/jono-hey/big-ideas-little-pictures/id/9781956403572/', label: 'Switzerland (Ex Libris)' },
  ],
  CN: [
    { href: 'https://3.cn/1Zj-dhXh', label: 'China (JD)' },
  ],
  NZ: [
    { href: 'https://www.mightyape.co.nz/product/big-ideas-little-pictures-hardback/36769294', label: 'New Zealand (Mighty Ape)' },
  ],
  ZA: [
    { href: 'https://www.takealot.com/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-/PLID92989211', label: 'South Africa (Takealot)' },
  ],
}

const regionLabels = {
  US: 'United States 🇺🇸',
  GB: 'United Kingdom 🇬🇧',
  AU: 'Australia 🇦🇺',
  CA: 'Canada 🇨🇦',
  CH: 'Switzerland 🇨🇭',
  CN: 'China',
  NZ: 'New Zealand 🇳🇿',
  ZA: 'South Africa 🇿🇦',
}

// Legacy analytics labels for Amazon clicks, keyed by detected country
const amazonLocationByCountry = {
  US: 'Amazon.com',
  GB: 'Amazon UK',
  AU: 'Australia (Amazon)',
  CA: 'Canada (Amazon)',
  BE: 'Belgium',
  BR: 'Brazil',
  FR: 'France',
  DE: 'Germany',
  IN: 'India',
  IE: 'Ireland',
  IT: 'Italy',
  JP: 'Japan',
  MX: 'Mexico',
  NL: 'Netherlands',
  PL: 'Poland',
  SA: 'Saudi Arabia',
  SG: 'Singapore',
  ES: 'Spain',
  SE: 'Sweden',
  ZA: 'South Africa (Amazon)',
}

const getAmazonAnalyticsLocation = (country) =>
  amazonLocationByCountry[country] ?? 'Amazon'

const getHomeRegions = (country) => {
  if (regionalStores[country]) return [country]
  return []
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

const StoreLinks = ({ stores }) => (
  <div className='flex flex-wrap gap-3 justify-center'>
    {stores.map((store) => (
      <OrderLink key={store.label} href={store.href}>
        {store.label}
      </OrderLink>
    ))}
  </div>
)

const ICON_DIR = '/images/explainer-kit/sketch-icons'

const FACTS = [
  { icon: `${ICON_DIR}/Book stack.svg`, value: '130+', label: 'sketches, old favourites and new' },
  { icon: `${ICON_DIR}/Puzzling.svg`, value: '10', label: 'sections, from nature to thinking' },
  { icon: `${ICON_DIR}/Lightbulb partial.svg`, value: '1', label: 'new idea on every page' },
]

const AMAZON_RATING = 4.8
// Kept as a rounded-down label so it doesn't go stale with every new review
const AMAZON_REVIEWS_LABEL = '200+'

// Stars filled to the real rating rather than rounded up to five
const RatingSummary = () => (
  <a
    href='#from-readers'
    onClick={scrollToId('from-readers')}
    className='inline-flex flex-col items-center gap-1 mt-8 no-underline hover:no-underline text-gray-600 dark:text-gray-300'
    aria-label={`Rated ${AMAZON_RATING} out of 5 from ${AMAZON_REVIEWS_LABEL} Amazon reviews. Read reviews`}
  >
    <span className={styles.stars} style={{ '--rating': `${(AMAZON_RATING / 5) * 100}%` }} aria-hidden='true'>
      ★★★★★
    </span>
    <span className='text-xs'>
      {AMAZON_RATING} · {AMAZON_REVIEWS_LABEL} Amazon reviews
    </span>
  </a>
)

const PRAISE = [
  {
    featured: true,
    name: 'Katy Milkman',
    role: 'Professor at the Wharton School of the University of Pennsylvania and author of the international bestseller How to Change',
    quote: ["I'm an enormous fan of the wonderful way Jono's sketches bring scientific insights to life for a wide audience."],
  },
  {
    featured: true,
    name: 'Mike Rohde',
    role: 'Bestselling author of The Sketchnote Handbook and illustrator of REWORK',
    quote: ["Big Ideas, Little Pictures is a magical collection of ideas, concepts, and wisdom—some that I've wondered about and others I've never thought about before—presented in a clear visual way that makes Jono's sketchplanations a joy to read, reference, and share. It's a fantastic book!"],
  },
  {
    featured: true,
    name: 'Dan Roam',
    role: 'International bestselling author of The Back of the Napkin, and Draw To Win',
    quote: [
      "As the world becomes more complex and fraught, the more we need clear and honest pictures to show us a better way. In his marvellous book, Big Ideas, Little Pictures, Jono Hey gives us the pictures we need.",
      "I can't think of a better gift for my mind, and yours.",
    ],
  },
  {
    name: 'Mark Frauenfelder',
    role: 'Founder of Boing Boing, Recomendo, Make and Wired magazines',
    quote: ["Jono's superpower is the ability to break down complex concepts into digestible, visually appealing explanations."],
  },
  {
    name: 'Brendan Leonard',
    role: 'Creator at Semi-rad and author of Make It: 50 Myths and Truths About Creating',
    quote: ["Jono Hey's Big Ideas Little Pictures is the kind of book that I want to devour all at once, with his brilliantly efficient illustrations breaking down complex ideas—but that I make myself ration to a few pages per day, to give myself time to absorb everything. Either way, it's the best bet I have to make myself seem more interesting as a dinner party guest."],
  },
  {
    name: 'Richard Shotton',
    role: 'Author of The Choice Factory',
    quote: ['Brilliant! It distills a variety of complex and profound ideas into simple to understand and beautifully drawn sketches.'],
  },
  {
    name: 'Trenton Moss',
    role: 'Bestselling author of Human Powered and Founder of Team Sterka',
    quote: ["I've loved following Sketchplanations for years. And finally, Jono has brought it all together in this wonderful book. Keep a copy in your home and show it to everyone who comes over."],
  },
  {
    name: 'Eva-Lotta Lamm',
    role: 'Designer and Visual Thinker',
    quote: [
      "Big Ideas, Little Pictures by Jono Hey is a beautiful and powerful book at the same time. On each page, Jono visualises a complex concept into a clear, engaging little drawing. His sketches don't just simplify ideas, they bring them to life and make them understandable at a glance.",
      "As a fellow visual thinker I'm in love with this wonderful book. It's a joy to dive in at any page, to get drawn in by the pictures and to learn a new fact with every turn of the page.",
    ],
  },
  {
    name: 'Gillian Cross',
    role: "Multi-award-winning children's book author",
    quote: [
      "I love this book. It will delight adults, fascinate children and help us all to grasp important ideas.",
      "Want to understand the four horsemen of relationship apocalypse? Or different types of phishing? Or the ten essentials for wilderness safety? Jono Hey's explanations are brief and clear – but it's his pictures that stick in your head.",
      "I meant to read it slowly, a few pages at a time, but it's such fun that I kept thinking, Just one more picture and finished it in one sitting.",
    ],
  },
  {
    name: 'Jason Barron',
    role: 'Author of The Visual MBA',
    quote: ["Jono's delightful book is a fantastic blend of text and visuals, making the topics easy to understand and remember. I found myself eager to turn each page, learning things I had never known before. I love this book and recommend it to anyone looking to enrich their knowledge at super speed with some creativity and fun."],
  },
  {
    name: 'Dad',
    quote: [
      <>
        I resent our bedroom looking so messy in the{' '}
        <FancyLink href='/tsundoku' aria-label='Learn more about Tsundoku'>
          tsundoku
        </FancyLink>{' '}
        sketch.
      </>,
    ],
  },
]

const PraiseCard = ({ praise, large = false }) => (
  <figure className={`m-0 ${styles.praiseCard} ${large ? styles.praiseCardLarge : ''}`}>
    <blockquote className={`m-0 p-0 border-0 not-italic ${large ? 'text-lg' : 'text-base'} leading-relaxed`}>
      {praise.quote.map((paragraph, i) => (
        <p key={i} className='mt-0 mb-4 last:mb-0'>
          {paragraph}
        </p>
      ))}
    </blockquote>
    <figcaption className='mt-5'>
      <cite className='not-italic font-semibold block'>{praise.name}</cite>
      {praise.role && <span className='text-sm text-gray-600 dark:text-gray-300'>{praise.role}</span>}
    </figcaption>
  </figure>
)

export async function getServerSideProps({ req }) {
  const country = req.headers['x-country'] || 'BOTH'
  return {
    props: { country },
  }
}

const scrollToId = (id) => (e) => {
  e.preventDefault()
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
}

const scrollToOrder = scrollToId('order')

const Book = ({ country }) => {
  const [showAllStores, setShowAllStores] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  const homeRegions = getHomeRegions(country)
  // Only visitors without a regional home see other bookstores (e.g. France, Germany)
  const moreStores = homeRegions.length === 0
    ? Object.values(regionalStores).flat()
    : []

  return (
    <>
      <Head>
        <title>{pageTitle('Big Ideas Little Pictures by Jono Hey')}</title>
        <meta
          name='description'
          content="Discover Big Ideas, Little Pictures by Jono Hey—a delightful book that simplifies complex ideas with clear illustrations. Explore reviews, FAQs, see what's inside, and order your copy."
        />
        <link rel='canonical' href='https://sketchplanations.com/big-ideas-little-pictures' />

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
      </Head>
      <JsonLd data={buildBookProductGraph()} />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert'>
        <div className='py-12'>
          <div id='hero' className='flex flex-col md:flex-row items-center gap-8 md:gap-12'>
            <div className='w-full md:w-1/2'>
              <div className='text-center'>
                <Book3D
                  cover={bigIdeasLittlePicturesCoverImage}
                  alt='Big Ideas Little Pictures by Jono Hey'
                  spineTitle='Big Ideas Little Pictures'
                  spineAuthor='Jono Hey'
                />
                <RatingSummary />
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <figure className={`m-0 ${styles.heroQuote}`}>
                <blockquote className='m-0 p-0 border-0 not-italic text-lg md:text-xl leading-relaxed font-medium'>
                  <p className='m-0'>
                    This is such a cool book. The range of Jono&apos;s knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You&apos;ll learn something on every page—and be entertained too.
                  </p>
                </blockquote>
                <figcaption className={`mt-5 text-2xl ${styles.heroQuoteCite}`}>Bill Gates</figcaption>
              </figure>
              <div className='mt-8 not-prose'>
                <a
                  href='#order'
                  className='btn-primary inline-block text-center px-8 py-3 text-lg no-underline hover:no-underline'
                  onClick={(e) => {
                    track('Book-hero-buy')
                    scrollToOrder(e)
                  }}
                >
                  Buy the book
                </a>
              </div>
            </div>
          </div>

          <div id='intro' className='text-center mt-12 max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-2'>Big Ideas Little Pictures</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>Explaining the world one sketch at a time</p>
            <p className='text-lg leading-relaxed'>
              Sketchplanations in a book! And now an eBook too. In this 288-page collection, Jono Hey collects together over 130
              inspiring, funny and relatable sketches about life. Combining existing and new topics, Big Ideas Little
              Pictures is a perfect gift of the wisdom and joy of Sketchplanations. Pop it on the table and start having great conversations about ideas.
            </p>
          </div>

          <ul className='not-prose list-none p-0 mt-12 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6'>
            {FACTS.map((fact) => (
              <li key={fact.label} className='flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center'>
                <Image src={fact.icon} alt='' width={64} height={64} className='h-16 w-16 object-contain shrink-0' unoptimized />
                <span>
                  <span className='block text-2xl font-bold leading-tight'>{fact.value}</span>
                  <span className='block text-gray-600 dark:text-gray-300'>{fact.label}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className='mt-16 scroll-mt-24'>
            <h2 id='sample-pages' className='text-3xl font-bold text-center mb-4'>Have a look inside</h2>
            <p className='text-center text-gray-600 dark:text-gray-300 mb-8'>
              A peek inside. <span className='hidden sm:inline'>Click to zoom in.</span><span className='sm:hidden'>Tap to zoom in.</span>
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
              {bookPageImages.map((image, index) => (
                <div
                  key={image.filename}
                  className={`aspect-[3/2] relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.bookPageContainer}`}
                  onClick={() => {
                    setGalleryIndex(index)
                    setGalleryOpen(true)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setGalleryIndex(index)
                      setGalleryOpen(true)
                    }
                  }}
                  aria-label={`View ${image.conceptName} in gallery`}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={600}
                      className={`${styles.bookPageImageAlt} group-hover:scale-105 transition-transform duration-300`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none'>
                    <div className={`${styles.zoomHint} bg-white/90 dark:bg-gray-800/90 p-2 rounded-full`}>
                      <ZoomIn size={24} className="text-gray-700 dark:text-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id='order' className='mt-24 max-w-3xl mx-auto scroll-mt-24'>
            <h2 className='text-3xl font-bold mb-8 text-center'>Order Big Ideas Little Pictures</h2>

            <div className='text-center'>
              <a
                href={AMAZON_LINK}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-primary inline-block w-full sm:w-auto px-8 py-3 text-lg no-underline hover:no-underline'
                aria-label='Buy Big Ideas Little Pictures on Amazon'
                onClick={() => {
                  track('Book-store-link', { location: getAmazonAnalyticsLocation(country) })
                }}
              >
                Buy on Amazon
              </a>
              <p className='text-sm text-gray-600 dark:text-gray-300 mt-2 mb-0'>
                Redirects to your local Amazon store
              </p>
            </div>

            <p className='mt-8 mb-0 text-center'>
              <Link
                href='https://www.kensingtonbooks.co.uk/product-page/big-ideas-little-pictures?utm_source=sketchplanations&utm_medium=website&utm_campaign=book_page&utm_content=signed_copy'
                target='_blank'
                rel='noopener noreferrer'
                className='btn-outline inline-block no-underline hover:no-underline'
                aria-label='Order a signed copy of Big Ideas Little Pictures'
                onClick={() => {
                  track('Book-store-link', { location: 'Signed copy' })
                }}
              >
                Order a signed copy
              </Link>
              <span className='block text-sm text-gray-600 dark:text-gray-300 mt-2'>
                from my friends at South Kensington Books in London
              </span>
            </p>

            {homeRegions.length > 0 && (
              <div className='space-y-10 mt-10'>
                {homeRegions.map((regionCode) => (
                  <div key={regionCode} className='text-center'>
                    <h3 className='text-xl font-semibold mb-4'>
                      {homeRegions.length === 1 ? 'Also available from' : regionLabels[regionCode]}
                    </h3>
                    <StoreLinks stores={regionalStores[regionCode]} />
                  </div>
                ))}
              </div>
            )}

            {moreStores.length > 0 && (
              <div className='mt-10'>
                {!showAllStores ? (
                  <div className='text-center'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowAllStores(true)
                        track('Book-store-link', { location: 'Show more stores' })
                      }}
                      className='text-blue hover:underline font-medium'
                      aria-expanded={showAllStores}
                      aria-controls='more-regional-stores'
                    >
                      Show more bookstores →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='text-center'>
                      <h3 className='text-xl font-semibold mb-4'>More regional bookstores</h3>
                      <div id='more-regional-stores'>
                        <StoreLinks stores={moreStores} />
                      </div>
                    </div>
                    <div className='text-center mt-8'>
                      <button
                        type='button'
                        onClick={() => {
                          setShowAllStores(false)
                          track('Book-store-link', { location: 'Show fewer stores' })
                        }}
                        className='text-blue hover:underline font-medium'
                        aria-expanded={showAllStores}
                        aria-controls='more-regional-stores'
                      >
                        Show fewer bookstores ↑
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className='mx-auto text-center'>
              <p className='mt-8 mb-0'>
                Or order from your local bookshop because we 💙 them.
              </p>
              <p className='text-sm mt-8 mb-0'>
                I earn from qualifying Amazon purchases through links on this site, including the Amazon button above.
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
                <p className='text-center'>Explore everything from cloud shapes to cognitive biases, from paradoxes to practical tips. These ten sections span the profound, the peculiar, and the playful — all explained in simple, memorable sketches.</p>
                <div className='max-w-none'>
                  
                  <ol className={styles.tocGrid}>
                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Nature&apos;s Nuances</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Coastline Paradox, Autumn Leaves, The Golden Ratio, The Moon Illusion...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Health and Healing</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Swiss Cheese Model, Microadventures, The Three-Day Effect, Sleep Basics...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>There&apos;s a Word for That</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Schadenfreude, Emotional Hot Potato, Tsundoku, Yak shaving...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Motivation and Inspiration</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Road to Success, Motivation Doesn&apos;t Last, 9,000 shots, Sleeping with a Mosquito...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Blind Spots</h4>
                      <p className={styles.tocDescription}><i>Including:</i> You Get What You Measure, The Paradox of Choice, The Spotlight Effect, Chesterton&apos;s Fence...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Starry-Eyed Surprises</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Atmospheric Perspective, Phases of the Moon, Know Your Clouds, The Potato Radius...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Business and Bytes</h4>
                      <p className={styles.tocDescription}><i>Including:</i> The Traveling Salesman Problem, Starting a Company, The Trust Equation, The Long Nose of Innovation...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Thinking About Thinking</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Thesis, Antithesis, Synthesis, Solvitur Ambulando, The BS Asymmetry Principle, The 20/40/60 Rule...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>The Big Picture</h4>
                      <p className={styles.tocDescription}><i>Including:</i> Solar System Sizes, The Overview Effect, The Continental Axis Hypothesis, 1.5 Billion Heartbeats...</p>
                    </li>

                    <li className={styles.tocSection}>
                      <h4 className={styles.tocTitle}>Life&apos;s Little Manuals</h4>
                      <p className={styles.tocDescription}><i>Including:</i> How to Win at Monopoly, Skip Rocks Like a Pro, The 60-30-10 Color Rule, The Awkwardness Vortex...</p>
                    </li>
                  </ol>

                  <p className='text-2xl font-bold mb-6 text-center'>
                    …and much, much more.
                  </p>
                  <p className='mb-6 text-center'>
                    The perfect coffee table book for sparking great conversations.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div id='praise' className='mt-24 max-w-5xl mx-auto scroll-mt-24'>
            <h2 className='text-3xl font-bold mb-12 text-center'>Praise for Big Ideas Little Pictures</h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 not-prose'>
              {PRAISE.filter((q) => q.featured).map((q) => (
                <PraiseCard key={q.name} praise={q} large />
              ))}
            </div>

            <details className={`mt-10 not-prose ${styles.morePraise}`}>
              <summary className='text-center cursor-pointer font-medium text-blue hover:underline'>
                <span className={styles.morePraiseOpen}>Read more praise</span>
                <span className={styles.morePraiseClose}>Show less</span>
              </summary>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
                {PRAISE.filter((q) => !q.featured).map((q) => (
                  <PraiseCard key={q.name} praise={q} />
                ))}
              </div>
            </details>
          </div>

          {/* Full-bleed so the row and its dark-mode backdrop span the page */}
          <div className='not-prose relative left-1/2 w-screen -translate-x-1/2 mt-16'>
            <ReaderQuotes
              quotes={BOOK_REVIEWS}
              heading='More nice things people have said'
              id='from-readers'
              icon={BOOK_REVIEWS_ICON}
              invite={null}
              sourceLinks={{ amazon: AMAZON_LINK, goodreads: GOODREADS_LINK }}
              analyticsPrefix='book_reviews'
              className='!mt-0 scroll-mt-24'
            />
          </div>

          <div id='faq' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold mb-8 text-center'>FAQ</h2>
            <div className='max-w-none border-t border-gray-200 dark:border-gray-700'>
              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Can I have a sneak preview?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
                  <p>
                    Of course. <FancyLink href='https://www.youtube.com/watch?v=1NQqM5ZjR2g' target='_blank' rel='noopener noreferrer' aria-label='Watch a video flicking through Big Ideas Little Pictures'>Watch me flick through the book</FancyLink>, or{' '}
                    <FancyLink href='https://www.youtube.com/watch?v=dQqP6aBLHYc' target='_blank' rel='noopener noreferrer' aria-label='Watch the Big Ideas Little Pictures book preview'>watch the book preview</FancyLink>.
                    You can also <FancyLink href='#sample-pages' aria-label='See sample pages'>see sample pages above</FancyLink>.
                  </p>
                </div>
              </details>
              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Can I order in a different country?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
                <p>
                  Yes. The Amazon button redirects to your local Amazon store automatically. If you&apos;re in the US, UK,
                  Australia, or another region with links on this page, you&apos;ll also see local bookstores for your area.
                </p>
                <p>
                  Don&apos;t see your country? Email me at{' '}
                  <FancyLink
                    href='mailto:jono.hey@gmail.com'
                    aria-label='Email Jono Hey'
                  >
                    jono.hey@gmail.com
                  </FancyLink>
                  {' '}— it helps us prioritise distribution where it&apos;s needed most.
                </p>
                </div>
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Is there an eBook version?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
                <p>
                  Yes! As of May 2025 there&apos;s now an eBook of Big Ideas Little Pictures.
                </p>
                <p>
                  It&apos;s great for quick reference, easier to carry on your commute or a flight, and a decent amount cheaper. It&apos;s packed with nearly 150 bite-sized sketches—perfect for dipping in when you need an idea, a shift in perspective, or a smile.
                </p>
                <p>You can buy it via the <FancyLink
                    href='#order'
                    aria-label='Buy the eBook of Big Ideas Little Pictures'
                  >order links above</FancyLink> — the Amazon button often includes the Kindle edition too, depending on your store. It&apos;s also on B&N, Apple Books, Kobo, and others.
                </p>
                <p>
                  A note on Kindles: because the book is so visual, the Kindle edition is made for the Kindle app (on a phone or tablet) and doesn&apos;t work on a regular black-and-white Kindle.
                </p>
                </div>
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Do you have photos or images I can use to share?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
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
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Is it available in other languages?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
                <p>
                  Not yet. Do let me know if you&apos;d like it in another language—it always helps to gauge demand.
                </p>
                </div>
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>What is the ISBN for Big Ideas Little Pictures?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
                <p>The ISBN-13 is 978-1956403572</p>
                <p>ISBN-10 is 1956403574</p>
                </div>
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>What&apos;s the picture on the cover?</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
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
              </details>

              <details className='group border-b border-gray-200 dark:border-gray-700 py-4'>
                <summary className='cursor-pointer font-semibold text-lg flex justify-between gap-4 list-none [&::-webkit-details-marker]:hidden'>
                  <span>Got another question? Please contact me</span>
                  <span aria-hidden='true' className='transition-transform group-open:rotate-45 text-2xl leading-none'>+</span>
                </summary>
                <div className='mt-3'>
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
              </details>
            </div>
          </div>

          <div id='why' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-4 mb-8'>
              <Image src={`${ICON_DIR}/Writing.svg`} alt='' width={72} height={72} className='h-16 w-16 object-contain m-0' unoptimized />
              <h2 className='text-3xl font-bold m-0'>Why a book?</h2>
            </div>
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
            <a
              href='#order'
              onClick={(e) => {
                track('Book-footer-buy')
                scrollToOrder(e)
              }}
              className='btn-primary inline-block w-full sm:w-auto px-12 py-3 text-lg no-underline hover:no-underline'
            >
              Order now
            </a>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGallery
        images={bookPageImages}
        initialIndex={galleryIndex}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
      />
    </>
  )
}

export default Book
