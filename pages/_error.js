import * as Sentry from '@sentry/react'

import Oops from 'components/Oops'

const Error = () => {
  return <Oops />
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  Sentry.captureException(err)
  return { statusCode }
}

export default Error
