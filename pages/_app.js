import Head from 'next/head'
import React from 'react'
import Headroom from 'react-headroom'
import Link from 'next/link'

import '../styles.css'

export default function MyApp({ Component, pageProps }) {
  const pageTitle = 'Sketchplanations - A weekly explanation in a sketch'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
        <meta name='msapplication-TileColor' content='#fbf8de' />
        <meta name='theme-color' content='#fbf8de' />
        <meta name='viewport' content='width = device-width, initial-scale = 1, minimum-scale = 1' />
        <meta property='og:title' content={pageTitle} key='title' />
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap' rel='stylesheet' />
      </Head>
      <Headroom>
        <div className='header'>
          <div className='inline-flex flex-col sm:flex-row items-center justify-center lg:justify-start flex-wrap lg:flex-no-wrap -m-1 sm:-m-3 flex-grow'>
            <div className='p-1 sm:p-3'>
              <Link href='/'>
                <a className='ident'>
                  <img className='ident__svg' src='/logo.svg' alt='Sketchplanations' />
                </a>
              </Link>
            </div>
            <div className='p-1 sm:p-3'>
              <p className='slogan'>Explaining one thing a week in a sketch</p>
            </div>
          </div>
          <nav className='whitespace-no-wrap'>
            <a href=''>About</a>
            <a href=''>Archive</a>
            <a href=''>Patreon</a>
            <a href=''>Subscribe</a>
          </nav>
        </div>
      </Headroom>
      <Component {...pageProps} />
      {/* <a href='' className='patreon'>
        <img width={108.5} height={25.5} src='https://c5.patreon.com/external/logo/become_a_patron_button.png' />
      </a> */}
      <style jsx>{``}</style>
    </>
  )
}
