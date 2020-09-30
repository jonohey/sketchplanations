import React from 'react'
import { RichText } from 'prismic-reactjs'
import { linkResolver } from 'prismic-configuration'
import Imgix from 'react-imgix'
import { TextHeader } from 'components'

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
}) => {
  return (
    <>
      <div className='root'>
        <TextHeader>{title}</TextHeader>
        <div className='body'>
          {body.map((slice, index) =>
            React.createElement(sliceTypesToComponent[slice.slice_type], { key: index, slice })
          )}
        </div>
      </div>
      <style jsx>
        {`
          .root {
            max-width: 800px;
            @apply pt-8 pb-20 px-6 mx-auto;
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

          .body :global(img) {
            @apply my-10;
          }
        `}
      </style>
    </>
  )
}

export default Page
