import { Link } from 'components'
import Logo from '../public/logo.svg'
import BMC from '../public/bmc.svg'

const NavigationBar = () => {
  return (
    <>
      <div className='py-20 px-16 bg-black text-white'>
        <Link href='/'>
          <a className='ident'>
            <Logo className='ident__svg' width='300' height='47' alt='Sketchplanations' />
          </a>
        </Link>
        <div className='grid grid-cols-2 gap-16 place-content-start'>
          <div>
            <div className='pb-8 max-w-lg'>
              <p>
                Hello 👋&nbsp;&nbsp;&nbsp;I'm Jono and I've been explaining a new concept each week with the help of a
                sketch since 2013.
              </p>
              <p className='mt-3'>
                There are ones about <a href='/tags/physics'>physics</a>, <a href='/tags/psychology'>psychology</a>,{' '}
                <a href='/tags/design'>design</a>, <a href='/tags/geography'>geography</a>,{' '}
                <a href='/tags/drawing'>drawing</a>, <a href='/tags/lifehack'>lifehacks</a>,{' '}
                <a href='/tags/food-and-drink'>food and drink</a>...you never know what you're going to get next ;o)
              </p>
            </div>
            <a className='coffee' href='https://www.buymeacoffee.com/sketchplanator' target='_blank' rel='noreferrer'>
              <BMC alt='Buy Me A Coffee' />
            </a>
          </div>
          <div className='ml-auto flex'>
            <nav className='grid grid-cols-3 gap-16'>
              <div className='grid gap-2 place-content-start'>
                <Link href='/about'>
                  <a>About</a>
                </Link>
                <Link href='/archive'>
                  <a>Archive</a>
                </Link>
                <Link href='/tags'>
                  <a>Tags</a>
                </Link>
              </div>
              <div className='grid gap-2 place-content-start'>
                <Link href='/subscribe'>
                  <a>Subscribe</a>
                </Link>
                <Link href='/api/random'>
                  <a>Random</a>
                </Link>
                <Link href='/search'>
                  <a>Search</a>
                </Link>
              </div>
              <div className='grid gap-2 place-content-start'>
                <a href='https://www.patreon.com/sketchplanations' target='_blank' rel='noreferrer'>
                  Patreon
                </a>
                <a href='https://www.redbubble.com/people/sketchplanator/shop' target='_blank' rel='noreferrer'>
                  Prints
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ident {
          @apply block mb-8;
        }

        .ident :global(svg) {
          width: 50vw;
          max-width: 200px;
          height: auto;
        }

        .ident :global(svg *) {
          fill: currentColor;
        }

        .coffee :global(svg) {
          max-width: 120px;
          height: auto;
        }
      `}</style>
    </>
  )
}

export default NavigationBar
