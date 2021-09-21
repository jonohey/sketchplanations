import { Page } from 'components'
import { client } from 'services/prismic'

const Privacy = ({ document }) => {
  return <Page document={document} />
}

Privacy.getInitialProps = async () => {
  const document = await client.getSingle('thanks')
  return { document }
}

export default Privacy
