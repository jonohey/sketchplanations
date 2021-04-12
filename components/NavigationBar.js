import Link from 'next/link'

import { Navigation } from 'components'

const NavigationBar = () => {
  return (
    <>
      <div className='px-6 py-2 flex bg-white z-10'>
        <Link href='/'>
          <a className='ident'>
            <img className='ident__svg' src='/logo.svg' width='300' height='47' alt='Sketchplanations' />
          </a>
        </Link>
        <div className='ml-auto flex'>
          <Navigation />
        </div>
      </div>
      <style jsx>{`
        .ident {
          @apply py-4 flex justify-center;
        }

        .ident__svg {
          width: 50vw;
          max-width: 200px;
          height: auto;
        }
      `}</style>
    </>
  )
}

export default NavigationBar
