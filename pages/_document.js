import Document, { Head, Html, Main, NextScript } from 'next/document'

import { pageTitle } from 'helpers'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang='en-GB'>
        <Head>
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
          <meta name='msapplication-TileColor' content='#fbf8de' />
          <meta name='theme-color' content='#fff' />
          <meta name='theme-color' content='#35363a' media='(prefers-color-scheme: dark)' />
          <meta key='og:title' property='og:title' content={pageTitle()} />
          <meta property='og:site_name' content='Sketchplanations' />
          <meta name='twitter:site' content='@sketchplanator' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
          <link rel='preconnect' href='https://js.stripe.com' crossOrigin='true' />
          <link href='https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap' rel='stylesheet' />
          <link
            rel='stylesheet'
            type='text/css'
            href='https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
