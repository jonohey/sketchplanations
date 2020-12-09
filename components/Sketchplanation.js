import React from 'react'
import { RichText } from 'prismic-reactjs'
import Shiitake from 'shiitake'
import Link from 'next/link'
import Imgix from 'react-imgix'

import { SocialSharing, TextHeader } from 'components'

const Sketchplanation = ({ sketchplanation, fullPost = false, hideContent = false }) => {
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
              src: `${image.url}&w=1600&blur=200&px=32`,
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
      <div className='content'>
        {!hideContent && (
          <>
            <TextHeader>{title}</TextHeader>
            <div className='body'>
              {fullPost ? (
                <>
                  <PayWhatYouWant />
                  <RichText render={body} />
                </>
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
          </>
        )}
        {fullPost && (
          <ul className='tags'>
            {sketchplanation.data.tags.map((tag, index) => (
              <li key={index}>
                <Link key={tag} href={`/tags/${tag.tag.slug}`}>
                  <a>{tag.tag.slug.replace(/-/, ' ')}</a>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {fullPost && <SocialSharing handle={uid} title={title} text={RichText.asText(body)} />}
      </div>
      <style jsx>{`
        .root {
          max-width: 600px;
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

        .body {
          @apply mx-auto;
        }

        .body :global(> * + *) {
          margin-top: 1.4em;
        }

        .body :global(b),
        .body :global(strong) {
          @apply font-semibold;
        }

        .body :global(i),
        .body :global(em) {
          @apply italic;
        }

        .body :global(a) {
          @apply text-bright-red;
        }

        .body :global(ul li) {
          list-style: outside disc;
          margin-left: 1.75rem;
        }

        .body :global(ol li) {
          list-style: outside decimal;
          margin-left: 1.75rem;
        }

        .tags {
          @apply flex flex-wrap -mx-2 mt-10 mb-10;
        }

        .tags a {
          @apply inline-block mx-2 text-sm whitespace-no-wrap;
          transition: all 0.1s ease-out;
          color: #888;
        }

        .tags a:hover {
          @apply text-bright-red;
        }
      `}</style>
    </div>
  )
}

export default Sketchplanation
