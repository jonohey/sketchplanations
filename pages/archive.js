import Gallery from 'react-photo-gallery'
import Imgix from 'react-imgix'
import Link from 'next/link'

import { Predicates } from 'services/prismic'
import { queryAll } from 'helpers'

const Archive = ({ sketchplanations }) => {
  const images = sketchplanations.map(
    ({
      uid,
      data: {
        title,
        image: {
          url,
          alt,
          dimensions: { width, height },
        },
      },
    }) => ({
      src: url,
      width,
      height,
      alt: alt || `${title} - Sketchplanations`,
      uid,
    })
  )

  const renderImage = ({ photo }) => {
    return (
      <Link href={`/${photo.uid}`} key={photo.uid}>
        <a>
          <Imgix
            className='lazyload'
            src={photo.src}
            attributeConfig={{
              src: 'data-src',
              srcSet: 'data-srcset',
              sizes: 'data-sizes',
            }}
            htmlAttributes={{
              src: `${photo.src}&w=400&blur=200&px=16`,
              style: { margin: 16, display: 'block' },
              width: photo.width,
              height: photo.height,
            }}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
          />
        </a>
      </Link>
    )
  }

  return (
    <>
      <div className='gallery'>
        <Gallery photos={images} direction='row' margin={16} targetRowHeight={400} renderImage={renderImage} />
      </div>
      <style jsx>{`
        .gallery {
          @apply overflow-hidden;
        }

        .gallery :global(.react-photo-gallery--gallery) {
          margin: -16px;
        }

        @screen sm {
          .gallery :global(.react-photo-gallery--gallery) {
            margin: 16px;
          }
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const sketchplanations = await queryAll(Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  return { props: { sketchplanations } }
}

export default Archive
