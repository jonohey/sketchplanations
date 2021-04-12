import { Link } from 'components'

const Navigation = () => {
  return (
    <>
      <nav>
        <Link href='/archive'>
          <a>Archive</a>
        </Link>
        <Link href='/tags'>
          <a>Tags</a>
        </Link>
        <Link href='/api/random'>
          <a>Random</a>
        </Link>
        <Link href='/search'>
          <a>
            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'>
              <path d='M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z' />
            </svg>
          </a>
        </Link>
      </nav>
      <style jsx>{`
         {
          /* :global(.headroom--pinned) nav,
        :global(.headroom--unfixed) nav {
          @apply pb-4;
        }

        @screen lg {
          :global(.headroom--pinned) nav,
          :global(.headroom--unfixed) nav {
            @apply pb-0;
          }
        } */
        }

        nav {
          @apply flex;
        }

        a {
          @apply px-3 text-black text-sm flex items-center justify-center;
        }

        @screen sm {
          a {
            @apply text-base;
          }
        }
      `}</style>
    </>
  )
}

export default Navigation
