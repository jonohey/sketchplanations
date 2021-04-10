import { Page } from 'components'
import { client } from 'prismic-configuration'

const Privacy = ({ document }) => {
  return <Page document={document} />
}

Privacy.getInitialProps = async () => {
  const document = await client.getSingle('wisdom')
  return { document }
}

export default Privacy
