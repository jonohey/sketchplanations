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
        <Link href='/search'>
          <a>Search</a>
        </Link>
        <Link href='/subscribe'>
          <a>Subscribe</a>
        </Link>
        <a href='https://www.patreon.com/sketchplanations' target='_blank' rel='noreferrer'>
          Patreon
        </a>
        <a href='https://www.redbubble.com/people/sketchplanator/shop' target='_blank' rel='noreferrer'>
          Prints
        </a>
      </nav>
      <style jsx>{`
        :global(.headroom--pinned) nav,
        :global(.headroom--unfixed) nav {
          @apply -mt-3 pb-4;
        }

        @screen lg {
          :global(.headroom--pinned) nav,
          :global(.headroom--unfixed) nav {
            @apply pb-0;
          }
        }

        nav {
          @apply -mx-2 flex flex-wrap justify-center;
        }

        nav > * {
          @apply py-1 px-2 text-blue text-sm;
        }

        @screen sm {
          nav > * {
            @apply py-3 px-3 text-blue text-base;
          }
        }

        .selected {
          @apply text-blue;
        }
      `}</style>
    </>
  )
}

export default Navigation
