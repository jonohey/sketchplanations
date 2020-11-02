import React from 'react'

const Error = () => {
  return (
    <div className='root'>
      <div className='content'>
        <img className='block mx-auto mt-8' src='/error.png' alt='Error' width={640} height={542.5} />
        <p className='contact-me text-center mx-auto mt-1 px-10'>You weren't supposed to see this. Sorry. I'd be really grateful to know how you got here so I can fix it. I'm at <a href='mailto:jono.hey@gmail.com'>jono.hey@gmail.com</a></p>
      </div>
      <style jsx>{`
        .contact-me {
          @apply flex flex-col items-center;
        }
      `}</style>
    </div>
  )
}

export default Error
