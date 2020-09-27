import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'
import Gallery from 'react-photo-gallery'
import Imgix from 'react-imgix'

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
      <Link href={`/${photo.uid}`}>
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
          overflow: hidden;
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

const queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const sketchplanations = []

  do {
    let response = await client.query(predicates, {
      ...options,
      pageSize: 100,
      page,
    })
    sketchplanations.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return sketchplanations
}

export async function getStaticProps() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  return { props: { sketchplanations } }
}

export default Archive
