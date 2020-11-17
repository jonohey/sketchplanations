import React from 'react'
import { Page } from 'components'
import { client } from 'prismic-configuration'

const Subscribe = ({ document }) => {
  return (
    <Page document={document}>
      <iframe
        className='mj-w-res-iframe'
        frameBorder='0'
        scrolling='no'
        marginHeight='0'
        marginWidth='0'
        src='https://app.mailjet.com/widget/iframe/5y2N/FyE'
        width='100%'
      ></iframe>
      <script type='text/javascript' src='https://app.mailjet.com/statics/js/iframeResizer.min.js'></script>
    </Page>
  )
}

Subscribe.getInitialProps = async () => {
  const document = await client.getSingle('subscribe')
  return { document }
}

export default Subscribe
