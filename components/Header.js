import Link from 'next/link'
import Navigation from 'components/Navigation'

const Header = () => {
  return (
    <>
      <div className='root'>
        <Link href='/'>
          <a className='ident'>
            <picture>
              <source srcSet='/logo-small.svg 100w' media='(max-width: 479px)' />
              <source srcSet='/logo.svg 100w' media='(min-width: 480px)' />
              <img src='/logo.svg' className='ident__svg' alt='Sketchplanations' />
            </picture>
          </a>
        </Link>
        <Navigation />
      </div>
      <style jsx>{`
        .root {
          @apply sticky grid grid-flow-col-dense gap-x-6 top-0 items-center justify-between px-6 bg-bg z-50 border-b border-bgDarker;
        }

        .ident {
          @apply block;
        }

        @screen dark {
          .ident {
            @apply invert;
          }
        }

        .ident__svg {
          @apply block;
          width: 100%;
          height: 100%;
          max-height: 2rem;
          fill: currentColor;
        }
      `}</style>
    </>
  )
}

export default Header
