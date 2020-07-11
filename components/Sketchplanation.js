import React from 'react'
import { RichText } from 'prismic-reactjs'
import { omit } from 'ramda'

export const Sketchplanation = ({ sketchplanation }) => {
  const { image, title, body } = sketchplanation.data
  return (
    <div className='root'>
      <pre>{JSON.stringify(omit(['data'], sketchplanation))}</pre>
      <pre>{JSON.stringify(sketchplanation.data)}</pre>
      <img src={image.url} alt={image.alt} width={image.width} height={image.height} />
      <h1>{title}</h1>
      <div className='body'>
        <RichText render={body} />
      </div>
      <style jsx>{`
        .root {
          @apply p-6 mx-auto;
          max-width: 640px;
        }

        img {
          @apply mb-10;
          box-shadow: 0 2.3rem 1rem -2rem #e2dcc5;
        }

        h1 {
          @apply text-2xl mb-3 mx-auto;
          max-width: 460px;
        }

        .body {
          @apply mx-auto;
          max-width: 460px;
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
