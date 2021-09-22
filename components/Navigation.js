import { Link } from 'components'

const Navigation = () => {
  return (
    <>
      <nav>
        <Link href='/about'>
          <a>About</a>
        </Link>
        <Link href='/explore'>
          <a>Explore</a>
        </Link>
        <Link href='/subscribe' className='big-screen'>
          <a>Subscribe</a>
        </Link>
        <a
          href='https://www.redbubble.com/people/sketchplanator/shop?asc=u'
          target='_blank'
          rel='noreferrer'
          className='big-screen'
        >
          Prints
        </a>
      </nav>
      <style jsx>{`
        nav {
          @apply flex justify-center -mx-2;
        }

        @screen sm {
          nav {
            @apply -mx-3;
          }
        }

        nav > * {
          @apply py-4 px-2;
        }

        @screen sm {
          nav > * {
            @apply px-3;
          }
        }

        .selected {
          @apply text-gray-400;
        }

        .big-screen {
          @apply hidden;
        }

        @screen sm {
          .big-screen {
            @apply block;
          }
        }
      `}</style>
    </>
  )
}

export default Navigation
