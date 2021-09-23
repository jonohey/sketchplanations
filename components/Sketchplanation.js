import { RichText } from 'prismic-reactjs'
import { sort } from 'fast-sort'
import Imgix from 'react-imgix'
import Link from 'next/link'
import React, { useState } from 'react'
import Shiitake from 'shiitake'
import TextLoop from 'react-text-loop'

// import { SocialSharing, TextHeader, PayWhatYouWant, Modal } from 'components'

import dynamic from 'next/dynamic'
const SocialSharing = dynamic(() => import('./SocialSharing'))
const TextHeader = dynamic(() => import('./TextHeader'))
const PayWhatYouWant = dynamic(() => import('./PayWhatYouWant'))
const Modal = dynamic(() => import('./Modal'))

const renderImage = ({ image, title }) => {
  const { width, height } = image.dimensions
  const heightRatio = width / height
  const adjustedWidth = 1600
  const adjustedheight = adjustedWidth * heightRatio

  return (
    <Imgix
      className='lazyload image'
      src={image.url}
      attributeConfig={{
        src: 'data-src',
        srcSet: 'data-srcset',
        sizes: 'data-sizes',
      }}
      htmlAttributes={{
        src: `${image.url}&w=1600&blur=200&px=32`,
        width: adjustedWidth,
        height: adjustedheight,
        alt: image.alt || `${title} - Sketchplanations`,
      }}
      width={adjustedWidth}
      height={adjustedheight}
      sizes='(min-width: 648px) 600px, (min-width: 640px) calc(100vw - 3rem), 100w'
    />
  )
}

const Sketchplanation = ({ sketchplanation, fullPost = false, hideContent = false }) => {
  const [pwywModalOpen, setPwywModalOpen] = useState(false)
  const {
    data: { image, title, body, redbubble_link_url },
    uid,
  } = sketchplanation

  const tags = sort(sketchplanation.data.tags).asc()

  return (
    <div className='root'>
      {fullPost ? (
        <div className='image'>{renderImage({ image, title })}</div>
      ) : (
        <Link href={`/${uid}`}>
          <a className='image'>{renderImage({ image, title })}</a>
        </Link>
      )}
      <div className='content'>
        {!hideContent && (
          <>
            {fullPost ? (
              <TextHeader>{title}</TextHeader>
            ) : (
              <Link href={`/${uid}`}>
                <a>
                  <TextHeader>{title}</TextHeader>
                </a>
              </Link>
            )}
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
            <div className='after-post'>
              <div className='licence-note'>
                <p>
                  You’re welcome to use and share this image and text for non-commercial purposes with attribution. Go
                  wild!
                  <br />
                  <a href='/licence' target='_blank' className='licence-link'>
                    See licence
                  </a>
                </p>
              </div>
              {redbubble_link_url && (
                <div className='mt-6'>
                  <a className='redbubble' href={redbubble_link_url} target='_blank' rel='noreferrer'>
                    <svg width='19' height='19' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z' />
                    </svg>
                    <span>Order as a </span>
                    <TextLoop>
                      <span>print</span>
                      <span>sticker</span>
                      <span>postcard</span>
                      <span>poster</span>
                      <span>greeting card</span>
                      <span>magnet</span>
                    </TextLoop>
                  </a>
                </div>
              )}
              <button className='pwyw-button' type='button' onClick={() => setPwywModalOpen(true)}>
                <svg width='14' height='19' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M11.951 7.095L7.757 11.29V0H6.243v11.29L2.05 7.095.979 8.166 7 14.187l6.022-6.021-1.07-1.07zM0 16.964h14v1.513H0v-1.513z' />
                </svg>
                Download highest-quality image
              </button>
              <Modal show={pwywModalOpen} onHide={() => setPwywModalOpen(false)}>
                <div className='pwyw'>
                  <PayWhatYouWant sketchplanationUid={sketchplanation.uid} sketchplanationTitle={title} />
                </div>
              </Modal>
              <SocialSharing handle={uid} title={title} text={RichText.asText(body)} />
              <ul className='tags'>
                {tags.map((tag, index) => (
                  <li key={index}>
                    <Link key={tag} href={`/tags/${tag.tag.slug}`}>
                      <a>{tag.tag.slug.replace(/-/, ' ')}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
          box-shadow: 0 2.3rem 1rem -2rem var(--color-sketchShadow);
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
          @apply text-blue;
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
          @apply inline-block mx-2 text-sm whitespace-nowrap;
          transition: all 0.1s ease-out;
          color: var(--color-subduedText);
        }

        .tags a:hover {
          color: var(--color-blue);
        }

        .after-post {
          @apply mt-10;
        }

        .licence-note {
          @apply p-5 bg-bgHighlight rounded;
        }

        .licence-link {
          color: var(--color-blue);
        }

        .pwyw {
          @apply p-8;
        }

        .pwyw-button {
          @apply mt-6;
          color: var(--color-subduedText);
        }

        .pwyw-button:hover {
          color: var(--color-blue);
        }

        .pwyw-button > svg {
          @apply inline-block mr-3;
          fill: currentColor;
        }

        .redbubble {
          color: var(--color-subduedText);
        }

        .redbubble:hover {
          color: var(--color-blue);
        }

        .redbubble > svg {
          @apply inline-block mr-3;
          fill: currentColor;
        }

        .image {
          @apply bg-paper;
        }
      `}</style>
    </div>
  )
}

export default Sketchplanation
