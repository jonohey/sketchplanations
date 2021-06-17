import { ButtonGroup } from 'components'
import { client } from 'prismic-configuration'
import { sort } from 'fast-sort'
import { useCookie } from 'next-cookie'
import { useState, useEffect } from 'react'
import Gallery from 'react-photo-gallery'
import Imgix from 'react-imgix'
import Link from 'next/link'
import Prismic from 'prismic-javascript'

const displayModeOptions = [
  { label: 'Images', value: 'images' },
  { label: 'Text', value: 'text' },
]

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

const cookieName = 'archiveDisplayMode'

const Archive = ({ sketchplanationsAsImages, sketchplanationsAsText }) => {
  const cookie = useCookie()
  const [displayMode, setDisplayMode] = useState(null)

  const handleDisplayModeChange = (newDisplayMode) => {
    setDisplayMode(newDisplayMode)
    cookie.set(cookieName, newDisplayMode)
  }

  useEffect(() => {
    setDisplayMode(cookie.get(cookieName) || 'images')
  }, [])

  return (
    <>
      <div>
        <div className='display-mode-buttons'>
          <ButtonGroup
            label='View'
            onChange={handleDisplayModeChange}
            options={displayModeOptions}
            value={displayMode}
          />
        </div>
        <div className='text'>
          {sketchplanationsAsText.map(({ uid, data: { title } }) => (
            <Link href={`/${uid}`} key={uid}>
              <a>{title}</a>
            </Link>
          ))}
        </div>
        <div className='images'>
          <Gallery
            photos={sketchplanationsAsImages}
            direction='row'
            margin={16}
            targetRowHeight={400}
            renderImage={renderImage}
          />
        </div>
      </div>
      <style jsx>{`
        .display-mode-buttons {
          @apply flex justify-center pt-6 px-6;
        }

        .text {
          @apply relative m-8 pb-20 grid-cols-1 gap-y-3 gap-x-8;
          display: ${displayMode === 'text' ? 'grid' : 'none'};
        }

        .text::before {
          content: '';
          @apply absolute z-10 top-0 left-0 w-full;
          height: 1px;
          background-color: #fff;
        }

        @screen md {
          .text {
            @apply grid-cols-2;
          }
        }

        @screen lg {
          .text {
            @apply grid-cols-3;
          }
        }

        @screen xl {
          .text {
            @apply grid-cols-4;
          }
        }

        @screen xxl {
          .text {
            @apply grid-cols-5;
          }
        }

        .text a {
          @apply block pt-2 border-t;
        }

        .text a + a {
          @apply block;
        }

        .text a:hover {
          @apply text-blue;
        }

        .images {
          @apply overflow-hidden;
          display: ${displayMode === 'images' ? 'block' : 'none'};
        }

        .images :global(.react-photo-gallery--gallery) {
          margin: -16px;
        }

        @screen sm {
          .images :global(.react-photo-gallery--gallery) {
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
  const sketchplanationsByPublishedAt = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  const sketchplanationsAsImages = sketchplanationsByPublishedAt.map(
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

  const sketchplanationsAsText = sort(sketchplanationsByPublishedAt).by({
    asc: true,
    comparer: (a, b) =>
      new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare(a.data.title, b.data.title),
  })

  return { props: { sketchplanationsAsImages, sketchplanationsAsText } }
}

export default Archive
