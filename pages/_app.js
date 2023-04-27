import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import 'global.css'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'

import Header from 'components/Header'
import SubscribeModal from 'components/SubscribeModal'
import { getCookie, pageTitle, setCookie } from 'helpers'
import useScrollPercentage from 'hooks/useScrollPercentage'

const inter = Inter({ subsets: ['latin'] })

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

const Sketchplanations = ({ Component, pageProps }) => {
  const [ref, percentage] = useScrollPercentage()
  const [scrolled, setScrolled] = useState(false)
  const [subscribeModalEnabled, setSubscribeModalEnabled] = useState(true)
  const [subscribeModalDismissed, setSubscribeModalDismissed] = useState(false)

  useEffect(() => {
    polyfillDownloadAttr()
    TagManager.initialize({ gtmId: 'GTM-WNS3LG4' })
    setSubscribeModalEnabled(!getCookie('mjPopinShown'))
  }, [])

  useEffect(() => {
    if (scrolled) return

    setScrolled(percentage > 0.5)
  }, [percentage])

  const handleSubscribeModalDismissed = () => {
    setSubscribeModalDismissed(true)
    setSubscribeModalEnabled(false)
    setCookie('mjPopinShown', true, 14)
  }

  return (
    <Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
      <Head>
        <title>{pageTitle()}</title>
        <meta name='viewport' content='width = device-width, initial-scale = 1, minimum-scale = 1' />
      </Head>
      <Header />
      <div ref={ref} className={inter.className}>
        <Component {...pageProps} />
      </div>
      {subscribeModalEnabled && (
        <SubscribeModal show={!subscribeModalDismissed && scrolled} onHide={handleSubscribeModalDismissed} />
      )}
      <a
        className='coffee'
        data-visible={scrolled}
        href='https://www.buymeacoffee.com/sketchplanator'
        target='_blank'
        rel='noreferrer'
      >
        <img src='/bmc.svg' width='4169' height='913' alt='Buy Me A Coffee' />
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
              "message": "Welcome! Stay and check out 100s of topics explained in sketches. Also, I use cookies."
            }
          })`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.prismic = {
            endpoint: 'https://Sketchplanations.cdn.prismic.io/api/v2'
          };`,
        }}
      />
      {/* <script
        type='text/javascript'
        src='https://static.cdn.prismic.io/prismic.min.js?repo=Sketchplanations.prismic.io&new=true'
      ></script> */}
    </Elements>
  )
}

export default Sketchplanations
