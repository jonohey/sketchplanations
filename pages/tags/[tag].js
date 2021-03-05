import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from '../../prismic-configuration'
import Gallery from 'react-photo-gallery'
import Imgix from 'react-imgix'
import { TextHeader } from 'components'
import { useRouter } from 'next/router'

const Tag = ({ tag, sketchplanations }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading…</div>
  }

  let images
  try {
    images = sketchplanations.map(({ uid, data: { title, image: { url, alt, dimensions: { width, height } } } }) => ({
      src: url,
      width,
      height,
      alt: alt || `${title} - Sketchplanations`,
      uid,
    }))
  } catch {
    console.log('sketchplanations', sketchplanations)
  }

  const renderImage = ({ photo }) => {
    return (
      <Link href='/[uid]' as={`/${photo.uid}`}>
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
      <div className='root'>
        <TextHeader className='text-center'>
          Sketchplanations tagged with <b>{tag.slugs[0]}</b>
        </TextHeader>
        <div className='gallery'>
          <Gallery photos={images} direction='row' margin={16} targetRowHeight={400} renderImage={renderImage} />
        </div>
      </div>
      <style jsx>
        {`
          .root {
            @apply pt-8 pb-20 mx-auto;
          }

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

          .gallery :global(img) {
            max-width: 570px;
          }

          .gallery :global(.react-photo-gallery--gallery > *) {
            justify-content: center;
          }
        `}
      </style>
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

export async function getStaticPaths() {
  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'))
  const tagPaths = tags.map((tag) => ({ params: { tag: tag.slugs[0] } }))

  return {
    paths: tagPaths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { tag } }) {
  const tagIdentifer = tag.replace(/-/g, ' ')
  let tagDocs = await client.query(Prismic.Predicates.at('my.tag.identifier', tagIdentifer), {
    pageSize: 1,
  })

  // The tag probably has a - in it
  if (tagDocs.total_results_size === 0) {
    tagDocs = await client.query(Prismic.Predicates.at('my.tag.identifier', tag), {
      pageSize: 1,
    })
  }

  const tagDoc = tagDocs?.results[0]

  const sketchplanations = await queryAll(
    [
      Prismic.Predicates.at('document.type', 'sketchplanation'),
      Prismic.Predicates.at('my.sketchplanation.tags.tag', tagDoc.id),
    ],
    {
      orderings: '[my.sketchplanation.published_at desc]',
    }
  )

  return { props: { tag: tagDoc, sketchplanations } }
}

export default Tag
