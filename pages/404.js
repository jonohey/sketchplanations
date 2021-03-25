import React from 'react'

const Error = () => {
  return (
    <div className='root'>
      <div className='content'>
        <img className='oops block mx-auto mt-4' src='/error.png' alt='Error' width={640} height={542.5} />
        <p className='help-text text-center mx-auto mt-1 px-10'>
          Maybe <a href='/search'>search Sketchplanations</a> or try looking in <a href='/tags'>tags</a>?
        </p>
        <p className='help-text text-center mx-auto mt-1 px-10'>
          Please let me know if a link is broken so I can fix it for others. I’m at{' '}
          <a href='mailto:jono.hey@gmail.com?subject=Broken link to fix!'>jono.hey@gmail.com</a>
        </p>
      </div>
      <style jsx>{`
        
        .help-text {
          max-width: 600px;
          width: 100%;
          margin: 0 auto 1.5em;
        }

        a:hover {
          text-decoration: underline;
        }

        a {
          @apply text-blue;
        }
      `}</style>
    </div>
  )
}

export default Error
