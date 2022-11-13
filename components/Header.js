import Link from 'next/link'
import Navigation from 'components/Navigation'

const Header = () => {
  return (
    <>
      <div className='root'>
        <Link href='/'>
          <a className='ident'>
            <picture>
              <source srcSet='/logo-small.svg 100w' media='(max-width: 549px)' />
              <source srcSet='/logo.svg 100w' media='(min-width: 550px)' />
              <img src='/logo.svg' className='ident__svg' alt='Sketchplanations' />
            </picture>
          </a>
        </Link>
        <Navigation />
      </div>
      <style jsx>{`
        .root {
          @apply sticky grid grid-flow-col-dense gap-x-6 top-0 items-center justify-between px-6 z-50;
          background-color: var(--color-bgTransparent);
          backdrop-filter: saturate(180%) blur(5px);
        }

        .ident {
          @apply block;
          width: 27px;
        }

        @media (min-width: 550px) {
          .ident {
            width: 205px;
          }
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
