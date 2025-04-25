import { track } from '@vercel/analytics'
import FancyLink from 'components/FancyLink'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

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
    {
      href: 'https://bookshop.org/p/books/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-time-jono-hey/19990252',
      label: 'Bookshop.org',
    },
	{ href: 'https://www.target.com/p/big-ideas-little-pictures-by-jono-hey-hardcover/-/A-89029770', label: 'Target' },
	{ href: 'https://www.booksamillion.com/p/Big-Ideas-Little-Pictures/Jono-Hey/9781956403572?id=8965300189654', label: 'Books A Million' },
  ],
  GB: [
    { href: 'https://amzn.to/3tsd3lF', label: 'Amazon UK' },
    {
      href: 'https://blackwells.co.uk/bookshop/product/Big-Ideas-Little-Pictures-by-Jono-Hey/9781804190029',
      label: 'Blackwells',
    },
    { href: 'https://www.waterstones.com/book/big-ideas-little-pictures/jono-hey/9781804190029', label: 'Waterstones' },
    {
      href: 'https://www.foyles.co.uk/witem/computing-science/big-ideas-little-pictures-explaining,jono-hey-9781804190029',
      label: 'Foyles',
    },
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
    className='inline-block px-6 py-2 rounded-full border border-blue text-blue hover:bg-blueLight transition-colors'
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
          content="Discover 'Big Ideas, Little Pictures' by Jono Hey—a delightful book that simplifies complex ideas with clear illustrations. Explore reviews, FAQs, see what's inside, and find out how to order your copy."
        />
        <link rel='canonical' href='https://sketchplanations.com/big-ideas-little-pictures' />
      </Head>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
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
              <blockquote className='text-xl md:text-2xl mb-4 font-medium'>
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
              <cite className='text-gray-600 dark:text-gray-300 block text-lg'>— Bill Gates</cite>
            </div>
          </div>

          <div id='intro' className='text-center mt-12 max-w-3xl mx-auto'>
            <h1 className='text-4xl font-bold mb-2'>Big Ideas Little Pictures</h1>
            <p className='text-xl text-gray-600 dark:text-gray-300 mb-8'>Explaining the world one sketch at a time</p>
            <p className='text-lg leading-relaxed'>
              At last! Sketchplanations in a book. In this 288-page collection, Jono Hey collects together over 130
              inspiring, funny and relatable sketches about life. Combining existing and new topics, Big Ideas Little
              Pictures is a perfect gift of the wisdom and joy of Sketchplanations.
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
                <div className='flex flex-wrap gap-4 justify-center mb-3'>
                  <OrderLink href='https://amzn.to/455q8Qp'>
                    Amazon.com
                  </OrderLink>
                  <OrderLink href='https://www.barnesandnoble.com/w/big-ideas-little-pictures-jono-hey/1143331058?ean=9781956403572'>
                    Barnes & Noble
                  </OrderLink>
                </div>
                <div className='flex flex-wrap gap-4 justify-center'>
                  <OrderLink href='https://bookshop.org/p/books/big-ideas-little-pictures-explaining-the-world-once-sketch-at-a-time-jono-hey/19990252'>
                    Bookshop.org
                  </OrderLink>
                  <OrderLink href='https://www.target.com/p/big-ideas-little-pictures-by-jono-hey-hardcover/-/A-89029770'>
                    Target
                  </OrderLink>
                  <OrderLink href='https://www.booksamillion.com/p/Big-Ideas-Little-Pictures/Jono-Hey/9781956403572?id=8965300189654'>
                    Books A Million
                  </OrderLink>
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
                    onClick={() => setShowAllStores(true)}
                    className='text-blue hover:underline text-sm font-medium'
                  >
                    Show stores in more regions →
                  </button>
                </div>
              ) : (
                <>
                  <div className='text-center'>
                    <h3 className='text-xl font-semibold mb-4'>Worldwide</h3>
                    <div className='flex flex-wrap gap-4 justify-center'>
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
                      onClick={() => setShowAllStores(false)}
                      className='text-blue hover:underline text-sm font-medium'
                    >
                      Show fewer stores ↑
                    </button>
                  </div>
                </>
              )}
            </div>

            <p className='text-gray-600 mt-8 text-center'>
              Or order from your local bookshop because we 💙 them.
            </p>
            <p className='text-sm text-gray-600 mt-8 text-center'>
              Notwithstanding, I earn from qualifying purchases through the Amazon Associates program if you use the Amazon links on this site, which helps me out if you are planning to buy from Amazon.
            </p>
          </div>

          <div id='whats-inside' className='mt-24'>
            <h2 className='text-3xl font-bold mb-4 text-center'>What&apos;s inside Big Ideas Little Pictures?</h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 mb-12 text-center'>
              Sample pages from Big Ideas Little Pictures
            </p>

            {/* Gallery in What's Inside section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 mb-16'>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={coastlineParadox}
                  alt='The Coastline Paradox - How the length of a coastline depends on how you measure it'
                  fill
                  className='object-contain rounded-lg'
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={tsundoku}
                  alt='Tsundoku - The act of acquiring books and letting them pile up without reading them'
                  fill
                  className='object-contain rounded-lg'
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={swissCheeseModel}
                  alt='The Swiss Cheese Model - For understanding accidents and improving safety'
                  fill
                  className='object-contain rounded-lg'
                />
              </div>
              <div className='aspect-[3/2] relative'>
                <Image
                  src={startingCompany}
                  alt='Starting a Company - Is like jumping off a cliff and assembling the plane on the way down'
                  fill
                  className='object-contain rounded-lg'
                />
              </div>
            </div>

            {/* Videos stacked vertically */}
            <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='space-y-8'>
                <div className='youtube-video-container'>
                  <iframe
                    width='560'
                    height='315'
                    src='https://www.youtube.com/embed/dQqP6aBLHYc?si=oogeEYEXru3cs53s&controls=0&rel=0'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    allowFullScreen
                  ></iframe>
                </div>
                <div className='youtube-video-container'>
                  <iframe
                    width='560'
                    height='315'
                    src='https://www.youtube.com/embed/1NQqM5ZjR2g?si=BOQLpNP4RDwVLnQ4'
                    title='YouTube video player'
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
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
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;This is such a cool book. The range of Jono&apos;s knowledge is astounding, and so is his
                    ability to digest complex ideas into deceptively simple drawings. You&apos;ll learn something on
                    every page—and be entertained too.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div className='font-semibold'>Bill Gates</div>
                  </div>
                </div>

                {/* Dan Roam Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
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
                      <div className='font-semibold'>Dan Roam</div>
                      <div className='text-sm text-gray-600'>
                        International bestselling author of The Back of the Napkin, and Draw To Win
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mike Rohde Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;Big Ideas, Little Pictures is a magical collection of ideas, concepts, and wisdom—some that
                    I&apos;ve wondered about and others I&apos;ve never thought about before—presented in a clear
                    visual way that makes Jono&apos;s sketchplanations a joy to read, reference, and share. It&apos;s a
                    fantastic book!&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Mike Rohde</div>
                      <div className='text-sm text-gray-600'>
                        Bestselling author of The Sketchnote Handbook and illustrator of REWORK
                      </div>
                    </div>
                  </div>
                </div>

                {/* Katy Milkman Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;I&apos;m an enormous fan of the wonderful way Jono&apos;s sketches bring scientific insights
                    to life for a wide audience.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Katy Milkman</div>
                      <div className='text-sm text-gray-600'>
                        Professor at the Wharton School of the University of Pennsylvania and author of the
                        international bestseller How to Change
                      </div>
                    </div>
                  </div>
                </div>

                {/* Richard Shotton Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;Brilliant! It distills a variety of complex and profound ideas into simple to understand and
                    beautifully drawn sketches.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Richard Shotton</div>
                      <div className='text-sm text-gray-600'>Author of The Choice Factory</div>
                    </div>
                  </div>
                </div>

                {/* Brendan Leonard Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;Jono Hey&apos;s Big Ideas Little Pictures is the kind of book that I want to devour all at
                    once, with his brilliantly efficient illustrations breaking down complex ideas—but that I make
                    myself ration to a few pages per day, to give myself time to absorb everything. Either way,
                    it&apos;s the best bet I have to make myself seem more interesting as a dinner party guest.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Brendan Leonard</div>
                      <div className='text-sm text-gray-600'>
                        Creator at Semi-rad and author of Make It: 50 Myths and Truths About Creating
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mark Frauenfelder Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;Jono&apos;s superpower is the ability to break down complex concepts into digestible, visually
                    appealing explanations.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Mark Frauenfelder</div>
                      <div className='text-sm text-gray-600'>
                        Founder of Boing Boing, Recomendo, Make and Wired magazines
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trenton Moss Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;I&apos;ve loved following Sketchplanations for years. And finally, Jono has brought it all
                    together in this wonderful book. Keep a copy in your home and show it to everyone who comes
                    over.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Trenton Moss</div>
                      <div className='text-sm text-gray-600'>
                        Bestselling author of Human Powered and Founder of Team Sterka
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jason Barron Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;Jono&apos;s delightful book is a fantastic blend of text and visuals, making the topics easy
                    to understand and remember. I found myself eager to turn each page, learning things I had never
                    known before. I love this book and recommend it to anyone looking to enrich their knowledge at super
                    speed with some creativity and fun.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Jason Barron</div>
                      <div className='text-sm text-gray-600'>Author of The Visual MBA</div>
                    </div>
                  </div>
                </div>

                {/* Gillian Cross Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
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
                      <div className='font-semibold'>Gillian Cross</div>
                      <div className='text-sm text-gray-600'>Multi-award-winning children&apos;s book author</div>
                    </div>
                  </div>
                </div>

                {/* Eva-Lotta Lamm Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
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
                      <div className='font-semibold'>Eva-Lotta Lamm</div>
                      <div className='text-sm text-gray-600'>Designer and Visual Thinker</div>
                    </div>
                  </div>
                </div>

                {/* Dad Quote */}
                <div className='bg-gray-50 p-8 rounded-lg'>
                  <blockquote className='text-base mb-6'>
                    &quot;I resent our bedroom looking so messy in the <FancyLink href='/tsundoku'>tsundoku</FancyLink> sketch.&quot;
                  </blockquote>
                  <div className='flex items-center gap-4'>
                    <div>
                      <div className='font-semibold'>Dad</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id='faq' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold mb-8 text-center'>FAQ</h2>
            <div className='space-y-8 prose'>
              <div>
                <h3 className='font-bold mb-2'>Interested in ordering from other countries?</h3>
                <p>
                  Please contact me at{' '}
                  <FancyLink href='mailto:jono.hey@gmail.com'>
                    jono.hey@gmail.com
                  </FancyLink>{' '}
                  and let me know where you are. It helps us get distribution in the right places first.
                </p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>Will there be an eBook?</h3>
                <p>
                  Yes. There should be a Kindle version of the book coming in 2025, but it&apos;s not out yet, and it&apos;s not nearly as nice on the coffee table.
                </p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>Do you have photos or images I can use to share?</h3>
                <p>
                  Yes. Please use images in the{' '}
                  <FancyLink href='https://drive.google.com/drive/folders/1QFZrtmseJO9kbH3NLwIq9RPaxeKd7Hb3?usp=sharing' target='_blank'>
                    basic media kit
                  </FancyLink>
                  . Let me know if it&apos;s missing something.
                </p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>Is it available in other languages?</h3>
                <p>
                  Not yet. Do let me know if you&apos;d like it in another language—it always helps to gauge demand.
                </p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>What is the ISBN for Big Ideas Little Pictures?</h3>
                <p>The ISBN-13 is 978-1956403572</p>
                <p>ISBN-10 is 1956403574</p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>What&apos;s the picture on the cover?</h3>
                <p>
                  The picture is my own version of Hokusai&apos;s remarkable <i>The Great Wave off
                  Kanagawa</i> or just the <i>Great Wave</i>. I once saw
                  the real thing at the British Museum in London. It&apos;s small, but few pictures captivate the way it
                  does. <FancyLink href='https://kottke.org/24/05/the-evolution-of-hokusais-great-wave' target='_blank'>Hokusai&apos;s wave evolved a lot throughout his life</FancyLink>.
                </p>
                <p>
                  <FancyLink href='https://www.redbubble.com/shop/ap/153657825'>
                    Buy a print of the Sketchplanations Wave
                  </FancyLink>
                </p>
              </div>

              <div>
                <h3 className='font-bold mb-2'>Got another question? Please contact me</h3>
                <p>
                  I&apos;m at:{' '}
                  <FancyLink href='mailto:jono.hey@gmail.com'>
                    jono.hey@gmail.com
                  </FancyLink>
                </p>
              </div>
            </div>
          </div>

          <div id='why-book' className='mt-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl font-bold mb-8'>Why a book?</h2>
            <div className='space-y-6 prose'>
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
