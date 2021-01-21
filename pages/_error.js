import * as Sentry from '@sentry/react'
import React from 'react'

const Error = () => {
  return (
    <div className='root'>
      <div className='content'>
        <img className='block mx-auto mt-8' src='/error.png' alt='Error' width={640} height={542.5} />
        <p className='contact-me text-center mx-auto mt-1 px-10'>
          Maybe <a href='/search'>search Sketchplanations</a> or try looking in <a href='/tags'>tags</a>? Please let me know if a link is wrong so I can fix it for others. I’m
          at <a href='mailto:jono.hey@gmail.com'>jono.hey@gmail.com</a>
        </p>
      </div>
      <style jsx>{`
        .contact-me {
          @apply flex flex-col items-center;
        }
      `}</style>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  Sentry.captureException(err)
  return { statusCode }
}

export default Error
