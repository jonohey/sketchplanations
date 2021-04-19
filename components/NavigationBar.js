import Link from 'next/link'

import { Navigation } from 'components'

const NavigationBar = () => {
  return (
    <>
      <div className='root px-6 py-2 flex flex-col sm:flex-row bg-white z-10 border-b'>
        <Link href='/'>
          <a className='ident'>
            <img className='ident__svg' src='/logo.svg' width='300' height='47' alt='Sketchplanations' />
          </a>
        </Link>
        <div className='mb-3 sm:mb-0 sm:ml-auto flex justify-center'>
          <Navigation />
        </div>
      </div>
      <style jsx>{`
        .root {
          border-color: rgba(0, 0, 0, 0.04);
        }

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
