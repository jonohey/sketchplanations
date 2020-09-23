import React from 'react'
import { RichText } from 'prismic-reactjs'
import Shiitake from 'shiitake'
import Link from 'next/link'
import Imgix from 'react-imgix'

import { SocialSharing } from 'components'

const Sketchplanation = ({ sketchplanation, fullPost = false }) => {
  const {
    data: { image, title, body },
    uid,
  } = sketchplanation
  return (
    <div className='root'>
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
              src: `${image.url}&w=800&blur=200&px=16`,
              width: image.width,
              height: image.height,
            }}
            width={image.width}
            height={image.height}
            alt={image.alt || `${title} - Sketchplanations`}
            sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
          />
        </a>
      </Link>
      <div className='content'>
        <h1>{title}</h1>
        <div className='body'>
          {fullPost ? (
            <RichText render={body} />
          ) : (
            <>
              <Shiitake lines={3} throttleRate={200}>
                {RichText.asText(body)}
              </Shiitake>
              <Link href={`/${uid}`}>
                <a>Read more…</a>
              </Link>
            </>
          )}
        </div>
        {fullPost && <SocialSharing handle={uid} title={title} text={RichText.asText(body)} />}
      </div>
      <style jsx>{`
        .root {
          max-width: 800px;
          @apply px-0;
        }

        @screen sm {
          .root {
            @apply px-6;
          }
        }

        .image {
          @apply block mb-10;
          box-shadow: 0 2.3rem 1rem -2rem #e2dcc5;
        }

        .image > :global(img) {
          @apply w-full h-auto;
        }

        .content {
          @apply px-6 mx-auto;
          max-width: 460px;
        }

        @screen sm {
          .content {
            @apply px-0;
          }
        }

        h1 {
          @apply text-3xl mb-3 mx-auto;
          font-weight: 300;
        }

        .body {
          @apply mx-auto;
        }

        .body :global(p + p) {
          margin-top: 1.4em;
        }

        .body :global(a) {
          @apply text-bright-red;
        }
      `}</style>
    </div>
  )
}

export default Sketchplanation
