import { PrismicToolbar } from '@prismicio/react'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Analytics } from '@vercel/analytics/react'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as CookieConsent from 'vanilla-cookieconsent'

import 'vanilla-cookieconsent/dist/cookieconsent.css'

import 'global.css'

import Header from 'components/Header'
import SubscribeInline from 'components/SubscribeInline'
import { pageTitle } from 'helpers'
import useScrollPercentage from 'hooks/useScrollPercentage'
import { client } from 'services/prismic'

import { GoogleTagManager } from '../gtm'

const inter = Inter({ subsets: ['latin'], weights: [300, 600] })

const polyfillDownloadAttr = () => {
  const downloadAttributeSupport = 'download' in document.createElement('a')
  const msSaveBlob = typeof window.navigator.msSaveBlob !== 'undefined'

  if (!downloadAttributeSupport && msSaveBlob) {
    document.addEventListener('click', (evt) => {
      const { target } = evt
      const { tagName } = target

      if (tagName === 'A' && target.hasAttribute('download')) {
        evt.preventDefault()

        const { href } = target
        const fileName = new URL(href).pathname.split('/').pop()

        const xhr = new XMLHttpRequest()

        xhr.open('GET', href)

        xhr.responseType = 'blob'

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4) {
            return
          }

          if (xhr.status === 200) {
            window.navigator.msSaveBlob(xhr.response, fileName)
          } else {
            console.error('download-attribute-polyfill:', xhr.status, xhr.statusText)
          }
        }

        xhr.send()
      }
    })
  }
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    enabled: process.env.NODE_ENV === 'production',
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
// const stripePromise = loadStripe(
//   'pk_live_51HHbylFCZUVebsQFDCj6av64TkOPAjByxTwhAJBWFchFGoBqvhQhKEvO0ZwKf7Bo8H7IDlxmNzKAZm8yIbcFX2UM00PR3aaRFu'
// )

const ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap',
    },
  ],
}

const Sketchplanations = ({ Component, pageProps, subscribeInlineDoc }) => {
  const router = useRouter()
  const [ref, percentage] = useScrollPercentage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    polyfillDownloadAttr()
    // TagManager.initialize({ gtmId: 'GTM-WNS3LG4' })
  }, [])

  useEffect(() => {
    if (scrolled) return

    setScrolled(percentage > 0.5)
  }, [percentage])

  useEffect(() => {
    /**
     * All config. options available here:
     * https://cookieconsent.orestbida.com/reference/configuration-reference.html
     */
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box',
          position: 'bottom right',
          flipButtons: true,
          equalWeightButtons: false,
        },
        preferencesModal: {
          equalWeightButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true, // this category is enabled by default
          readOnly: true, // this category cannot be disabled
        },
        analytics: {
          enabled: false,
          readOnly: false,
          autoClear: {
            cookies: [
              {
                name: '_ga',
              },
              {
                name: '_hj',
              },
            ],
          },
        },
      },

      language: {
        default: 'en',
        translations: {
          en: {
            consentModal: {
              title: 'Welcome',
              description: 'Stay and check out 100s of topics explained in sketches. Also, I use cookies.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage',
            },
            preferencesModal: {
              title: 'Manage cookie preferences',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              sections: [
                {
                  title: 'Somebody said ... cookies?',
                  description: 'Toggle on/off below as you wish. I use cookies to help make the site better.',
                },
                {
                  title: 'Strictly Necessary cookies',
                  description:
                    'These cookies are essential for the proper functioning of the website and cannot be disabled.',

                  //this field will generate a toggle linked to the 'necessary' category
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Performance and Analytics',
                  description:
                    'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'More information',
                  description: 'See my <a href="/privacy">privacy page</a>',
                },
              ],
            },
          },
        },
      },
    })
  }, [])

  return (
    <>
      <GoogleTagManager gtmId='GTM-WNS3LG4' />
      <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
        <Head>
          <title>{pageTitle()}</title>
          <meta name='viewport' content='width = device-width, initial-scale = 1, minimum-scale = 1' />
        </Head>
        <div ref={ref} className={inter.className}>
          <Header />
          {!['/', '/search', '/subscribe', '/subscribed', '/blank'].includes(router.pathname) && (
            <SubscribeInline doc={subscribeInlineDoc} />
          )}
          <Component {...pageProps} />
          <a
            className='coffee'
            data-visible={scrolled}
            href='https://www.buymeacoffee.com/sketchplanator'
            target='_blank'
            rel='noreferrer'
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/bmc.svg' width='4169' height='913' alt='Buy Me A Coffee' />
          </a>
        </div>
        <PrismicToolbar repositoryName='sketchplanations' />
      </Elements>
      <Analytics />
    </>
  )
}

Sketchplanations.getInitialProps = async () => {
  const subscribeInlineDoc = await client.getSingle('subscribe_inline')

  return { subscribeInlineDoc }
}

export default Sketchplanations
