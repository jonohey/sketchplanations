import React from 'react'
import { RichText } from 'prismic-reactjs'
import Shiitake from 'shiitake'
import Link from 'next/link'

const Sketchplanation = ({ sketchplanation, fullPost = false }) => {
  const {
    data: { image, title, body },
    uid,
  } = sketchplanation
  return (
    <div className='root'>
      <Link href={`/${uid}`}>
        <a>
          <img
            src={image.url}
            alt={image.alt || `${title} - Sketchplanations`}
            width={image.width}
            height={image.height}
          />
        </a>
      </Link>
      <div className='content'>
        <h1>{title}</h1>
        <div className='body'>
          {fullPost && <RichText render={body} />}
          {!fullPost && (
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

        img {
          @apply mb-10;
          box-shadow: 0 2.3rem 1rem -2rem #e2dcc5;
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
