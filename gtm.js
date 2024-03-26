'use client'

// Taken from https://github.com/vercel/next.js/blob/canary/packages/third-parties/src/google/gtm.tsx
// Customised by Alistair Holt
import React, { useEffect } from 'react'

let currDataLayerName

export function GoogleTagManager(props) {
  const { gtmId, dataLayerName = 'dataLayer', auth, preview, dataLayer } = props

  if (currDataLayerName === undefined) {
    currDataLayerName = dataLayerName
  }

  const gtmLayer = dataLayerName !== 'dataLayer' ? `&l=${dataLayerName}` : ''
  const gtmAuth = auth ? `&gtm_auth=${auth}` : ''
  const gtmPreview = preview ? `&gtm_preview=${preview}&gtm_cookies_win=x` : ''

  useEffect(() => {
    // performance.mark is being used as a feature use signal. While it is traditionally used for performance
    // benchmarking it is low overhead and thus considered safe to use in production and it is a widely available
    // existing API.
    // The performance measurement will be handled by Chrome Aurora

    performance.mark('mark_feature_usage', {
      detail: {
        feature: 'next-third-parties-gtm',
      },
    })
  }, [])

  return (
    <>
      <script
        type='text/plain'
        data-category='analytics'
        data-service='Google Tag Manager'
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${dataLayer ? `w[l].push(${JSON.stringify(dataLayer)})` : ''}
      })(window,'${dataLayerName}');`,
        }}
      />
      <script
        type='text/plain'
        data-category='analytics'
        data-service='Google Tag Manager'
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}${gtmLayer}${gtmAuth}${gtmPreview}`}
      />
    </>
  )
}

export const sendGTMEvent = (data) => {
  if (currDataLayerName === undefined) {
    console.warn(`GTM has not been initialized`)
    return
  }

  if (window[currDataLayerName]) {
    window[currDataLayerName].push(data)
  } else {
    console.warn(`GTM dataLayer ${currDataLayerName} does not exist`)
  }
}
