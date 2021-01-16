import React, { useState, useEffect } from 'react'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import { RichText } from 'prismic-reactjs'
import { Sketchplanation, PrevNextSketchplanation } from 'components'
import Head from 'next/head'
import { pageTitle } from 'helpers'

const Post = ({ sketchplanation, similarSketchplanations }) => {
  const {
    data: { image, title, body },
    uid,
    id,
  } = sketchplanation

  const [previousSketchplanation, setPreviousSketchplanation] = useState(null)
  const [nextSketchplanation, setNextSketchplanation] = useState(null)

  const fetchPreviousAndNext = async () => {
    setPreviousSketchplanation(
      (
        await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
          pageSize: 1,
          after: id,
          orderings: '[my.sketchplanation.published_at desc]',
        })
      ).results[0]
    )
    setNextSketchplanation(
      (
        await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
          pageSize: 1,
          after: id,
          orderings: '[my.sketchplanation.published_at]',
        })
      ).results[0]
    )
  }

  useEffect(() => {
    fetchPreviousAndNext()
  }, [])

  return (
    <>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta key='og:title' property='og:title' content={title} />
        <meta property='og:description' content={RichText.asText(body)} />
        <meta property='og:image' content={`${image.url}&w=1200`} />
        <meta property='og:url' content={`https://sketchplanations.vercel.app/${uid}`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:image:alt' content={title} />
      </Head>
      <div className='sketchplanations'>
        <Sketchplanation sketchplanation={sketchplanation} fullPost />
      </div>
      <div className='prevnext'>
        <div>
          <PrevNextSketchplanation kind='next' sketchplanation={nextSketchplanation} />
        </div>
        <div>
          <PrevNextSketchplanation kind='previous' sketchplanation={previousSketchplanation} />
        </div>
      </div>
      {similarSketchplanations.results.length > 0 && (
        <>
          <h2 className='similar-header'>Want more? Try these…</h2>
          <div className='similar'>
            {similarSketchplanations.results.map((sketchplanation) => (
              <div key={sketchplanation.id}>
                <Sketchplanation sketchplanation={sketchplanation} hideContent />
              </div>
            ))}
          </div>
        </>
      )}
      <style jsx>{`
        .similar-header {
          @apply mb-10 text-center;
        }

        .similar {
          @apply flex flex-wrap justify-center px-6 pt-10 pb-20;
          border-top: solid 1px rgba(0, 0, 0, 0.04);
          box-shadow: 0 -2.3rem 1rem -2rem rgba(0, 0, 0, 0.03);
        }

        @screen sm {
          .similar {
            @apply px-3;
          }
        }

        .similar > * {
          @apply w-full;
        }

        .similar > * + * {
          @apply mt-16;
        }

        @screen sm {
          .similar > * + * {
            @apply mt-0;
          }
        }

        @screen sm {
          .similar > * {
            @apply w-1/3;
          }
        }

        .prevnext {
          @apply mx-auto px-6 pb-16;
          max-width: 600px;
          box-sizing: border-box;
        }

        .prevnext > * + * {
          @apply mt-8;
        }
      `}</style>
    </>
  )
}

Post.getInitialProps = async ({ query: { uid } }) => {
  const sketchplanation = await client.getByUID('sketchplanation', uid)
  const similarSketchplanations = await client.query(
    [Prismic.Predicates.at('document.type', 'sketchplanation'), Prismic.Predicates.similar(sketchplanation.id, 3)],
    { pageSize: 6 }
  )

  return { sketchplanation, similarSketchplanations }
}

export default Post
