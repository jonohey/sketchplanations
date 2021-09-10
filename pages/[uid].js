import React, { useState, useEffect } from 'react'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import { RichText } from 'prismic-reactjs'
// import { Sketchplanation, PrevNextSketchplanation } from 'components'
import Head from 'next/head'
import { pageTitle } from 'helpers'
import dynamic from 'next/dynamic'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))
const PrevNextSketchplanation = dynamic(() => import('../components/PrevNextSketchplanation'))

const SketchplanationPage = ({
  sketchplanation,
  previousSketchplanation,
  nextSketchplanation,
  similarSketchplanations,
}) => {
  const {
    data: { image, title, body },
    uid,
    id,
  } = sketchplanation

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
      <div className='prev-next-header'>
        {nextSketchplanation ? (
          <a
            href={`/${nextSketchplanation?.uid}`}
            className='prev-next-header__previous'
            title={nextSketchplanation?.data?.title}
          >
            <div className='caret-wrapper'>
              <svg
                className='caret -rotate-180'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                fillRule='evenodd'
                clipRule='evenodd'
              >
                <path d='M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z' />
              </svg>
            </div>
            <span>Previous</span>
          </a>
        ) : (
          <span />
        )}
        <a href='/api/random'>Random</a>
        {previousSketchplanation ? (
          <a
            href={`/${previousSketchplanation?.uid}`}
            className='prev-next-header__next'
            title={previousSketchplanation?.data?.title}
          >
            <div className='caret-wrapper'>
              <svg
                className='caret'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                fillRule='evenodd'
                clipRule='evenodd'
              >
                <path d='M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z' />
              </svg>
            </div>
            <span>Next</span>
          </a>
        ) : (
          <span />
        )}
      </div>
      <div className='sketchplanation'>
        <Sketchplanation sketchplanation={sketchplanation} fullPost />
      </div>
      <div className='prev-next-footer'>
        <div>
          <PrevNextSketchplanation kind='next' sketchplanation={nextSketchplanation} />
        </div>
        <div>
          <PrevNextSketchplanation kind='previous' sketchplanation={previousSketchplanation} />
        </div>
      </div>
      {similarSketchplanations.results.length > 0 && (
        <>
          <h2 className='similar-header'>Keep exploring</h2>
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
        .sketchplanation {
          @apply flex flex-wrap justify-center pb-6;
        }

        @screen lg {
          .sketchplanation {
            @apply pb-12;
          }
        }

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

        .prev-next-header {
          @apply mx-auto px-3 text-sm;
          display: grid;
          place-items: center;
          grid-template-columns: 1fr auto 1fr;
          max-width: 600px;
          box-sizing: border-box;
        }

        .prev-next-header__previous {
          @apply w-full flex items-center;
        }
        .prev-next-header__next {
          @apply w-full flex flex-row-reverse items-center;
        }

        .prev-next-header > * {
          @apply py-2;
        }
        .prev-next-header > *:nth-child(2) {
          @apply px-3;
        }

        .caret-wrapper {
          @apply flex-none m-2;
          @apply inline-flex items-center justify-center border rounded text-sm font-sans uppercase;
          width: 1.5rem;
          height: 1.5rem;
          color: #a9b1ba;
        }

        .caret {
          width: 0.5rem;
        }

        .caret * {
          fill: #000;
        }

        @screen sm {
          .prev-next-header {
            @apply px-6 text-base;
          }
        }

        .prev-next-header a {
          @apply text-blue;
        }

        .prev-next-footer {
          @apply mx-auto px-6 pb-16;
          max-width: 600px;
          box-sizing: border-box;
        }

        .prev-next-footer > * + * {
          @apply mt-8;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps({ params: { uid } }) {
  const sketchplanation = await client.getByUID('sketchplanation', uid)

  const similarSketchplanations = await client.query(
    [Prismic.Predicates.at('document.type', 'sketchplanation'), Prismic.Predicates.similar(sketchplanation.id, 3)],
    { pageSize: 6 }
  )

  const previousSketchplanation =
    (
      await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
        pageSize: 1,
        after: sketchplanation.id,
        orderings: '[my.sketchplanation.published_at desc]',
      })
    )?.results?.[0] || null

  const nextSketchplanation =
    (
      await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
        pageSize: 1,
        after: sketchplanation.id,
        orderings: '[my.sketchplanation.published_at]',
      })
    )?.results?.[0] || null

  return { props: { sketchplanation, previousSketchplanation, nextSketchplanation, similarSketchplanations } }
}

const queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const documents = []

  do {
    let response = await client.query(predicates, {
      ...options,
      pageSize: 100,
      page,
    })
    documents.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return documents
}

export async function getStaticPaths() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'))
  const sketchplanationsPaths = sketchplanations.map((sketchplanation) => ({
    params: { uid: sketchplanation.slugs[0] },
  }))

  return {
    paths: sketchplanationsPaths,
    fallback: true,
  }
}

export default SketchplanationPage
