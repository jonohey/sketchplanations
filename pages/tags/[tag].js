import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from '../../prismic-configuration'

const Tag = ({ tag, sketchplanations }) => {
  return (
    <>
      <pre>{JSON.stringify(tag, null, 2)}</pre>
      <ul>
        {sketchplanations.results.map((sketchplanation) => (
          <li key={sketchplanation.id}>
            <Link href={`/${sketchplanation.uid}`}>{sketchplanation.data.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

Tag.getInitialProps = async ({ query: { tag } }) => {
  // const tagDoc = await client.getByUID('tag', tag)
  const tagDocs = await client.query(Prismic.Predicates.at('my.tag.identifier', tag), {
    pageSize: 1,
  })

  const tagDoc = tagDocs?.results[0]

  const sketchplanations = await client.query(
    [
      Prismic.Predicates.at('document.type', 'sketchplanation'),
      Prismic.Predicates.at('my.sketchplanation.tags.tag', tagDoc.id),
    ],
    { pageSize: 100 }
  )

  return { tag: tagDoc, sketchplanations }
}

export default Tag
