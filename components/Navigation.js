import { RoughNotation } from 'react-rough-notation'
import { useRouter } from 'next/router'

import { Link } from 'components'

const roughNotiationProps = {
  iterations: 1,
  animationDuration: 200,
  animationDelay: 50,
  padding: 3,
  type: 'underline',
}

const Navigation = () => {
  const router = useRouter()

  const isSelected = (path) => router.pathname === path

  return (
    <>
      <nav className='root'>
        <Link href='/about' className='item'>
          <a>
            <RoughNotation show={isSelected('/about')} {...roughNotiationProps}>
              About
            </RoughNotation>
          </a>
        </Link>
        <Link href='/explore' className='item'>
          <a>
            <RoughNotation show={isSelected('/explore')} {...roughNotiationProps}>
              Explore
            </RoughNotation>
          </a>
        </Link>
        <Link href='/subscribe' className='item big-screen'>
          <a>
            <RoughNotation show={isSelected('/subscribe')} {...roughNotiationProps}>
              Subscribe
            </RoughNotation>
          </a>
        </Link>
        <a
          href='https://www.redbubble.com/people/sketchplanator/shop?asc=u'
          target='_blank'
          rel='noreferrer'
          className='item big-screen'
        >
          Prints
        </a>
      </nav>
      <style jsx>{`
        .root {
          @apply relative flex justify-center -mx-2;
        }

        @screen sm {
          .root {
            @apply -mx-3;
          }
        }

        .root :global(a) {
          @apply relative flex items-center py-4 px-2 overflow-hidden;
        }

        @screen sm {
          .root :global(a) {
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
