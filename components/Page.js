import { createElement } from 'react'
import { RichText } from 'prismic-reactjs'
import dynamic from 'next/dynamic'
import Imgix from 'react-imgix'
import cn from 'classnames'

import { linkResolver } from 'services/prismic'

const TextHeader = dynamic(() => import('./TextHeader'))

const Text = ({ slice }) => RichText.render(slice.primary.content, linkResolver)

const Photo = ({
  slice: {
    primary: { photo },
  },
}) => (
  <Imgix
    className='lazyload'
    src={photo.url}
    attributeConfig={{
      src: 'data-src',
      srcSet: 'data-srcset',
      sizes: 'data-sizes',
    }}
    htmlAttributes={{
      src: `${photo.url}&blur=200&px=16`,
      width: photo.width,
      height: photo.height,
    }}
    width={photo.width}
    height={photo.height}
    alt={photo.alt}
    sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
  />
)

const Html = ({ slice }) => <div dangerouslySetInnerHTML={{ __html: RichText.asText(slice.primary.html) }} />

const sliceTypesToComponent = {
  text: Text,
  photo: Photo,
  html: Html,
}

const Page = ({
  document: {
    data: { title, body },
  },
  inline = false,
  children,
}) => {
  return (
    <>
      <div className={cn('page-root', { 'page-root--inline': inline })}>
        <TextHeader>{title}</TextHeader>
        <div className='page-body'>
          {body.map((slice, index) => createElement(sliceTypesToComponent[slice.slice_type], { key: index, slice }))}
          {children}
        </div>
      </div>
      <style jsx global>
        {`
          .page-root {
            max-width: 800px;
            @apply relative pt-8 pb-20 px-6 mx-auto;
          }

          @screen sm {
            .page-root {
              @apply px-12;
            }
          }

          .page-root--inline {
            @apply pb-0 px-6;
          }

          .page-body {
            @apply block mx-auto;
            max-width: 800px;
          }

          .page-body > * + * {
            margin-top: 1.4em;
          }

          .page-body b,
          .page-body strong {
            @apply font-semibold;
          }

          .page-body i,
          .page-body em {
            @apply italic;
          }

          .page-body a {
            color: var(--color-blue);
          }

          .page-body ul li {
            list-style: outside disc;
            margin-left: 1.75rem;
          }

          .page-body ol li {
            list-style: outside decimal;
            margin-left: 1.75rem;
          }

          .page-body img {
            @apply my-10;
          }

          .page-body p {
            @apply max-w-prose;
          }
        `}
      </style>
    </>
  )
}

export default Page
