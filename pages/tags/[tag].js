import { useRouter } from 'next/router'
import Gallery from 'react-photo-gallery'
import Link from 'next/link'
import { Predicates } from '@prismicio/client'

import { client } from 'services/prismic'
import { TextHeader } from 'components'

import styles from './[tag].module.css'
import Image from 'next/image'

const Tag = ({ tag, sketchplanations }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading…</div>
  }

  let images
  try {
    images = sketchplanations.map(
      ({
        uid,
        data: {
          title,
          image: {
            url,
            alt,
            dimensions: { width, height },
          },
        },
      }) => ({
        src: url,
        width,
        height,
        alt: alt || `${title} - Sketchplanations`,
        uid,
      })
    )
  } catch {
    console.log('sketchplanations', sketchplanations)
  }

  const renderImage = ({ photo }) => {
    return (
      <Link href={`/${photo.uid}`}>
        <Image
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
        />
      </Link>
    )
  }

  return (
    <div className={styles.root}>
      <TextHeader className={styles.header}>
        Sketchplanations tagged with <b>{tag.slugs[0]}</b>
      </TextHeader>
      <div className={styles.gallery}>
        <Gallery photos={images} direction='row' margin={8} targetRowHeight={400} renderImage={renderImage} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const tags = await client.getAllByType('tag')
  const tagPaths = tags.map((tag) => ({ params: { tag: tag.slugs[0] } }))

  return {
    paths: tagPaths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { tag } }) {
  const tagIdentifer = tag.replace(/-/g, ' ')
  let tagDocs = await client.query(Predicates.at('my.tag.identifier', tagIdentifer), {
    pageSize: 1,
  })

  // The tag probably has a - in it
  if (tagDocs.total_results_size === 0) {
    tagDocs = await client.query(Predicates.at('my.tag.identifier', tag), {
      pageSize: 1,
    })
  }

  const tagDoc = tagDocs?.results[0]

  const sketchplanations = (
    await client.get({
      predicates: [
        Predicates.at('document.type', 'sketchplanation'),
        Predicates.at('my.sketchplanation.tags.tag', tagDoc.id),
      ],
      orderings: {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
    })
  ).results

  return { props: { tag: tagDoc, sketchplanations } }
}

export default Tag
