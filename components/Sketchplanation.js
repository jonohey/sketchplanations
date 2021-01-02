import React, { useState } from 'react'
import { RichText } from 'prismic-reactjs'
import Shiitake from 'shiitake'
import Link from 'next/link'
import Imgix from 'react-imgix'

import { SocialSharing, TextHeader, PayWhatYouWant, Modal } from 'components'

const Sketchplanation = ({ sketchplanation, fullPost = false, hideContent = false }) => {
  const [pwywModalOpen, setPwywModalOpen] = useState(false)
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
          </>
        )}
        {fullPost && (
          <>
            <ul className='tags'>
              {sketchplanation.data.tags.map((tag, index) => (
                <li key={index}>
                  <Link key={tag} href={`/tags/${tag.tag.slug}`}>
                    <a>{tag.tag.slug.replace(/-/, ' ')}</a>
                  </Link>
                </li>
              ))}
            </ul>
            <SocialSharing handle={uid} title={title} text={RichText.asText(body)} />
            <button className='pwyw-button' type='button' onClick={() => setPwywModalOpen(true)}>
              <svg width='14' height='19' xmlns='http://www.w3.org/2000/svg'>
                <path d='M11.951 7.095L7.757 11.29V0H6.243v11.29L2.05 7.095.979 8.166 7 14.187l6.022-6.021-1.07-1.07zM0 16.964h14v1.513H0v-1.513z' />
              </svg>
              Download highest-quality image
            </button>
            <Modal show={pwywModalOpen} onHide={() => setPwywModalOpen(false)}>
              <div className='pwyw'>
                <PayWhatYouWant sketchplanationUid={sketchplanation.uid} />
              </div>
            </Modal>
          </>
        )}
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

        .pwyw {
          @apply p-8;
        }

        .pwyw-button {
          @apply mt-10 text-sm;
          color: #888;
        }

        .pwyw-button:hover {
          @apply text-bright-red;
        }

        .pwyw-button > svg {
          @apply inline-block mr-3;
          fill: currentColor;
        }
      `}</style>
    </div>
  )
}

export default Sketchplanation
