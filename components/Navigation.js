import React from 'react'
import { Link } from 'components'

const Navigation = () => {
  return (
    <>
      <nav>
        <Link href='/about'>
          <a>About</a>
        </Link>
        <Link href='/archive'>
          <a>Archive</a>
        </Link>
        <Link href='/tags'>
          <a>Tags</a>
        </Link>
        <a href='https://www.patreon.com/sketchplanations' target='_blank' rel='noreferrer'>
          Patreon
        </a>
        <a
          href='https://sketchplanations.us7.list-manage.com/subscribe?u=9cb0e0c4f7192ab482322d4f9&id=a5a82e1a38'
          target='_blank'
          rel='noreferrer'
        >
          Subscribe
        </a>
      </nav>
      <style jsx>{`
        :global(.headroom--pinned) nav,
        :global(.headroom--unfixed) nav {
          @apply -mt-4 pb-4;
        }

        @screen lg {
          :global(.headroom--pinned) nav,
          :global(.headroom--unfixed) nav {
            @apply mt-0 pb-0;
          }
        }

        nav {
          @apply -mx-4;
        }

        nav > * {
          @apply py-3 px-2 text-blue text-sm;
        }

        @screen sm {
          nav > * {
            @apply py-3 px-4 text-blue text-base;
          }
        }

        .selected {
          @apply text-bright-red;
        }
      `}</style>
    </>
  )
}

export default Navigation
