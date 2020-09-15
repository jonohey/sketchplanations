import Prismic from 'prismic-javascript'
import { client } from '../../prismic-configuration'

const Tag = ({ tag }) => {
  return (
    <>
      <pre>{JSON.stringify(tag, null, 2)}</pre>
    </>
  )
}

Tag.getInitialProps = async ({ query: { tag } }) => {
  // const tagDoc = await client.getByUID('tag', tag)
  const tagDocs = await client.query(Prismic.Predicates.at('my.tag.identifier', tag), {
    pageSize: 1,
  })

  return { tag: tagDocs?.results[0] }
}

export default Tag
