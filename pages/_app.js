import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'
import Head from 'next/head'
import React from 'react'
import Headroom from 'react-headroom'
import Link from 'next/link'
import NextNprogress from 'nextjs-progressbar'
import { pageTitle } from 'helpers'
import { Navigation } from 'components'

import 'styles.css'

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

export default function MyApp({ Component, pageProps, router: { route } }) {
  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
        <meta name='msapplication-TileColor' content='#fbf8de' />
        <meta name='theme-color' content='#fbf8de' />
        <meta name='viewport' content='width = device-width, initial-scale = 1, minimum-scale = 1' />
        <meta key='og:title' property='og:title' content={pageTitle()} />
        <meta property='og:site_name' content='Sketchplanations' />
        <meta name='twitter:site' content='@sketchplanator' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link href='https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap' rel='stylesheet' />
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css'
        />
        <script async src='https://www.googletagmanager.com/gtag/js?id=UA-72222206-1'></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-41793508-1');`,
          }}
        />
      </Head>
      <NextNprogress color='#1253B5' options={{ showSpinner: false }} />
      <Headroom className={route === '/' ? 'hide-when-unfixed' : ''}>
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
          <Navigation />
        </div>
      </Headroom>
      <Component {...pageProps} />
      <a className='coffee' href='https://www.buymeacoffee.com/sketchplanator' target='_blank' rel='noreferrer'>
        <img src='/bmc.svg' alt='Buy Me A Coffee' />
      </a>
      <script src='https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js' />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.cookieconsent.initialise({
            "palette": {
              "popup": {
                "background": "#000"
              },
              "button": {
                "background": "#fbf8de"
              }
            },
            "theme": "classic",
            "content": {
              "message": "Sketchplanations uses cookies to ensure you get the best experience."
            }
          })`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.prismic = {
            endpoint: 'https://sketchplanations.cdn.prismic.io/api/v2'
          };`,
        }}
      />
      {/* <script
        type='text/javascript'
        src='https://static.cdn.prismic.io/prismic.min.js?repo=sketchplanations.prismic.io&new=true'
      ></script> */}
    </>
  )
}
