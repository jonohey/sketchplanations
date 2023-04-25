import { Predicates } from '@prismicio/client'
import { useRouter } from 'next/router'

import { TextHeader } from 'components'
import SketchplanationsGrid from 'components/SketchplanationsGrid'
import { client } from 'services/prismic'

import styles from './[tag].module.css'

const Tag = ({ tag, sketchplanations }) => {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading…</div>
  }

  return (
    <div className={styles.root}>
      <TextHeader className={styles.header}>
        Sketchplanations tagged with <b>{tag.slugs[0]}</b>
      </TextHeader>
      <SketchplanationsGrid prismicDocs={sketchplanations} />
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

  const sketchplanations = await client.dangerouslyGetAll({
    predicates: [
      Predicates.at('document.type', 'sketchplanation'),
      Predicates.at('my.sketchplanation.tags.tag', tagDoc.id),
    ],
    orderings: {
      field: 'my.sketchplanation.published_at',
      direction: 'desc',
    },
  })

  return { props: { tag: tagDoc, sketchplanations } }
}

export default Tag
