import * as prismicH from '@prismicio/helpers'
import classNames from 'classnames'
import { ImageJsonLd } from 'next-seo'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import styles from './[uid].module.css'

import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))
const PrevNextSketchplanation = dynamic(() => import('../components/PrevNextSketchplanation'))

function truncate(string, limit) {
  if (string.length <= limit) return string

  const words = string.split(' ')
  let truncatedString = ''

  for (let i = 0; i < words.length; i++) {
    if (truncatedString.length + words[i].length + 1 <= limit - 1) {
      truncatedString += words[i] + ' '
    } else {
      break
    }
  }

  // Add ellipsis if the original string was truncated
  if (truncatedString.length < string.length) {
    truncatedString = truncatedString.trim() + '…'
  }

  return truncatedString
}

const SketchplanationPage = ({
  sketchplanation,
  previousSketchplanation,
  nextSketchplanation,
  // similarSketchplanations,
}) => {
  const {
    data: { image, title, body, published_at: publishedAt },
    uid,
  } = sketchplanation

  const [randomHandle, setRandomHandle] = useState(null)

  useEffect(() => {
    const fetchRandomHandle = async () => {
      try {
        const res = await fetch('/api/random')
        const { handle } = await res.json()
        setRandomHandle(handle)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRandomHandle()
  }, [uid])

  return (
    <>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta name='robots' content='max-image-preview:large' />
        <meta name='description' content={truncate(prismicH.asText(body), 160)} />
        <meta key='og:title' property='og:title' content={title} />
        <meta property='og:description' content={truncate(prismicH.asText(body), 200)} />
        <meta property='og:image' content={`${image.url}&w=1200`} />
        <meta property='og:url' content={`https://sketchplanations.com/${uid}`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:image:alt' content={image.alt} />
        <meta name='twitter:image' content={`${image.url}&w=1200`} />
        <meta name='twitter:title' content={truncate(title, 70)} />
        <meta name='twitter:description' content={truncate(prismicH.asText(body), 200)} />
      </Head>
      <div className={styles['prev-next-header']}>
        {nextSketchplanation ? (
          <Link
            href={`/${nextSketchplanation?.uid}`}
            className={styles['prev-next-header__previous']}
            title={nextSketchplanation?.data?.title}
          >
            <div className={styles['caret-wrapper']}>
              <svg
                className={classNames(styles.caret, '-rotate-180')}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                fillRule='evenodd'
                clipRule='evenodd'
              >
                <path d='M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z' />
              </svg>
            </div>
            <span>Previous</span>
          </Link>
        ) : (
          <span />
        )}
        <Link href={`/${randomHandle}`} className={!randomHandle && 'invisible'}>
          Random
        </Link>
        {previousSketchplanation ? (
          <Link
            href={`/${previousSketchplanation?.uid}`}
            className={styles['prev-next-header__next']}
            title={previousSketchplanation?.data?.title}
          >
            <div className={styles['caret-wrapper']}>
              <svg
                className={styles.caret}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
                fillRule='evenodd'
                clipRule='evenodd'
              >
                <path d='M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z' />
              </svg>
            </div>
            <span>Next</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className={styles.sketchplanation}>
        <Sketchplanation key={sketchplanation.id} sketchplanation={sketchplanation} fullPost />
      </div>
      <div className={styles['prev-next-footer']}>
        <PrevNextSketchplanation kind='next' sketchplanation={nextSketchplanation} />
        <PrevNextSketchplanation kind='previous' sketchplanation={previousSketchplanation} />
      </div>
      {/* {similarSketchplanations.results.length > 0 && (
      <>
        <h2 className={styles['similar-header']}>Keep exploring</h2>
        <div className={styles.similar}>
          {similarSketchplanations.results.map((sketchplanation) => (
            <div key={sketchplanation.id}>
              <Sketchplanation sketchplanation={sketchplanation} hideContent />
            </div>
          ))}
        </div>
      </>
    )} */}
      <ImageJsonLd
        images={[
          {
            contentUrl: `${image.url}&w=1200`,
            thumbnail: {
              type: 'ImageObject',
              url: `${image.url}&w=200`,
            },
            creator: {
              '@type': 'Person',
              name: 'Jono Hey',
            },
            creditText: 'Jono Hey',
            copyrightNotice: 'Creative Commons Attribution-NonCommercial 4.0 International License',
            license: 'https://creativecommons.org/licenses/by-nc/4.0/',
            acquireLicensePage: 'https://sketchplanations.com/licence',
            name: title,
            caption: image.alt,
            description: prismicH.asText(body),
            isFamilyFriendly: true,
            representativeOfPage: true,
            datePublished: publishedAt,
          },
        ]}
      />
    </>
  )
}

export async function getStaticProps({ params: { uid } }) {
  const sketchplanation = await client.getByUID('sketchplanation', uid)

  // const similarSketchplanations = await client.get({
  //   filters: [prismic.filter.at('document.type', 'sketchplanation'), prismic.filter.similar(sketchplanation.id, 3)],
  //   pageSize: 6,
  // })

  const previousSketchplanation =
    (
      await client.getByType('sketchplanation', {
        pageSize: 1,
        after: sketchplanation.id,
        orderings: [
          {
            field: 'my.sketchplanation.published_at',
            direction: 'desc',
          },
        ],
      })
    )?.results?.[0] || null

  const nextSketchplanation =
    (
      await client.getByType('sketchplanation', {
        pageSize: 1,
        after: sketchplanation.id,
        orderings: [
          {
            field: 'my.sketchplanation.published_at',
          },
        ],
      })
    )?.results?.[0] || null

  return { props: { sketchplanation, previousSketchplanation, nextSketchplanation } }
}

export async function getStaticPaths() {
  const sketchplanations = await client.getAllByType('sketchplanation')
  const sketchplanationsPaths = sketchplanations.map((sketchplanation) => ({
    params: { uid: sketchplanation.uid },
  }))

  return {
    paths: sketchplanationsPaths,
    fallback: false,
  }
}

export default SketchplanationPage
