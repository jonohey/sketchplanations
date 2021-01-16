import React from 'react'
import Link from 'next/link'
import Imgix from 'react-imgix'

const PrevNextSketchplanation = ({ sketchplanation, kind }) => {
  if (!sketchplanation) return null

  const {
    data: { image, title },
    uid,
  } = sketchplanation

  const label = kind === 'previous' ? 'Previous' : 'Next'

  return (
    <>
      {/* <pre>{JSON.stringify(sketchplanation)}</pre> */}
      <Link href={`/${uid}`}>
        <a className='image'>
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
          <div className='info'>
            <span className='label'>{label}</span>
            <span className='title'>{title}</span>
          </div>
        </a>
      </Link>
      <style jsx>{`
        .image {
          @apply flex p-4 items-center border rounded-lg overflow-hidden shadow;
          flex-direction: ${kind === 'previous' ? 'row' : 'row-reverse'};
          text-align: ${kind === 'previous' ? 'left' : 'right'};
        }

        .image :global(img) {
          @apply flex-none;
          width: 38%;
          max-width: 140px;
        }

        .info {
          @apply px-4;
        }

        .label {
          @apply block;
        }

        .title {
          @apply block text-lg font-semibold;
        }
      `}</style>
    </>
  )
}

export default PrevNextSketchplanation
