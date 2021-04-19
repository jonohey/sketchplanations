import Link from 'next/link'
import { useRouter } from 'next/router'
import Imgix from 'react-imgix'
import { useHotkeys } from 'react-hotkeys-hook'

const PrevNextSketchplanation = ({ sketchplanation, kind }) => {
  const keyboardKey = kind === 'next' ? 'j' : 'k'
  const secondaryKeyboardKey = kind === 'next' ? 'left' : 'right'
  const router = useRouter()

  const navigate = () => router.push(`/${sketchplanation?.uid}`)

  useHotkeys(keyboardKey, navigate, {}, [sketchplanation])
  useHotkeys(secondaryKeyboardKey, navigate, {}, [sketchplanation])

  if (!sketchplanation) return null

  const {
    data: { image, title },
    uid,
  } = sketchplanation

  return (
    <>
      <Link href={`/${uid}`}>
        <a className='image'>
          {/* <div className='caret-wrapper'>
            <svg
              className='caret'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
              fillRule='evenodd'
              clipRule='evenodd'
            >
              <path d='M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z' />
            </svg>
          </div> */}
          <div className='info'>
            {/* <span className='title'>{title}</span> */}
            <span className='title'>{kind === 'previous' ? 'Previous' : 'Next'}</span>
            <div className='keyboard-shortcuts'>
              <kbd className='keyboard-key'>{keyboardKey}</kbd>
            </div>
          </div>
          <Imgix
            className='lazyload'
            src={image.url}
            attributeConfig={{
              src: 'data-src',
              srcSet: 'data-srcset',
              sizes: 'data-sizes',
            }}
            htmlAttributes={{
              src: `${image.url}&w=400&blur=200&px=32`,
              width: image.width,
              height: image.height,
            }}
            width={image.width}
            height={image.height}
            alt={image.alt || `${title} - Sketchplanations`}
            sizes='(min-width: 648px) 600px, (min-width: 640px) calc(100vw - 3rem), 100w'
          />
        </a>
      </Link>
      <style jsx>{`
        .image {
          @apply flex flex-col text-center overflow-hidden;
          height: 30vw;
          max-height: 10rem;
        }

        .image :global(img) {
          @apply w-full max-w-xs;
          box-shadow: 0 2.3rem 1rem -2rem #e2dcc5;
        }

         {
          /* @screen sm {
          .image :global(img) {
            width: 38%;
          }
        } */
        }

        .info {
          @apply mb-4 flex items-center justify-center flex-row;
        }

        .label {
          @apply block;
        }

        .title {
          @apply block font-semibold;
        }

        @screen sm {
          .title {
            @apply text-lg;
          }
        }

        .caret-wrapper {
          @apply flex-none items-center;
          width: 1rem;
          transform: ${kind === 'next' ? 'rotate(180deg)' : 'none'};
        }

        .caret * {
          fill: #000;
        }

        .keyboard-shortcuts {
          @apply mx-2;
        }

        .keyboard-key {
          @apply inline-flex items-center justify-center border border-paper-dark rounded text-sm font-sans uppercase text-paper-darkest;
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </>
  )
}

export default PrevNextSketchplanation
