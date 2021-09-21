import { Page } from 'components'
import { client } from 'services/prismic'

const Subscribed = ({ document }) => {
  return <Page document={document} />
}

Subscribed.getInitialProps = async () => {
  const document = await client.getSingle('subscribed')
  return { document }
}

export default Subscribed
