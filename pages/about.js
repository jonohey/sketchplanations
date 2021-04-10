import { Page } from 'components'
import { client } from 'prismic-configuration'

const Privacy = ({ document }) => {
  return <Page document={document} />
}

Privacy.getInitialProps = async () => {
  const document = await client.getSingle('about')
  return { document }
}

export default Privacy
