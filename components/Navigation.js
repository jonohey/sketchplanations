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
        <Link href='/subscribe'>
          <a>Subscribe</a>
        </Link>
      </nav>
      <style jsx>{`
        :global(.headroom--pinned) nav,
        :global(.headroom--unfixed) nav {
          @apply -mt-4 pb-4;
        }

        @screen lg {
          :global(.headroom--pinned) nav,
          :global(.headroom--unfixed) nav {
            @apply pb-0;
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
