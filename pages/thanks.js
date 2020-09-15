import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Post = ({ document }) => {
  return (
    <>
      <pre>sketchplanation:{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

Post.getInitialProps = async ({ query: { uid } }) => {
  const document = await client.getSingle('thanks')
  return { document }
}

export default Post
