import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Thanks = ({ document }) => {
  return (
    <>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

Thanks.getInitialProps = async ({ query: { uid } }) => {
  const document = await client.getSingle('thanks')
  return { document }
}

export default Thanks
