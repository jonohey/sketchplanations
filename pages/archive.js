import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'
import Gallery from 'react-photo-gallery'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const Archive = ({ sketchplanations, tags }) => {
  const tagsFromSketchplanations = sketchplanations
    .map((sketchplanation) => sketchplanation.data.tags.map((tag) => tag.tag.slug))
    .flat()
    .filter((tag) => tag)

  const tagsWithCounts = tags.map((tag) => {
    const identifier = tag.data.identifier
    const slug = tag.slugs[0]
    return {
      tag: identifier,
      slug,
      count: countOccurrences(tagsFromSketchplanations, slug),
    }
  })

  const images = sketchplanations.map(({ data: { image: { url, dimensions: { width, height } } } }) => ({
    src: `${url}?w=960`,
    width,
    height,
  }))

  return (
    <>
      <div className='gallery'>
        <Gallery photos={images} direction='row' margin={10} targetRowHeight={400} />
      </div>
      {/* <pre>{JSON.stringify(images, null, 2)}</pre> */}
      {/* <div className='flex'>
        <div className='p-8'>
          <ul className='sps'>
            {sketchplanations.map((sketchplanation) => (
              <li key={sketchplanation.id}>
                <Link href={`/${sketchplanation.uid}`}>
                  <a>
                    <img width={250} src={`${sketchplanation.data.image.url}&w=500`} alt={sketchplanation.data.title} />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='p-8'>
          <ul>
            {tagsWithCounts.map(({ tag, count }) => (
              <li key={tag}>
                <Link href={`/tags/${tag}`}>
                  <a className='flex justify-between'>
                    {tag} <b>{count}</b>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      <style jsx>{`
        .gallery {
          margin: 10px;
        }
        .sps {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin: -0.5rem;
        }

        .sps > * {
          padding: 0.5rem;
        }

        b {
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

const queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const sketchplanations = []

  do {
    let response = await client.query(predicates, {
      ...options,
      pageSize: 100,
      page,
    })
    console.log('response.total_pages', response.total_pages, page)
    sketchplanations.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return sketchplanations
}

Archive.getInitialProps = async () => {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier]',
  })

  return { sketchplanations, tags }
}

export default Archive
