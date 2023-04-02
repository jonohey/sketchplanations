import { Page } from 'components'
import { client } from 'services/prismic'

import styles from './subscribe.module.css'
import { useState } from 'react'

const Subscribe = ({ subscribeDocument, subscribedDocument }) => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setProcessing(true)

    await fetch(`/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })

    setSubmitted(true)
    setProcessing(false)
  }

  if (submitted) return <Page document={subscribedDocument} />

  return (
    <Page document={subscribeDocument}>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type='email'
          required
          placeholder='Email address'
          autoFocus
          autoComplete='email'
          pattern='.+@.+'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={processing}
        />
        <button type='submit' className={styles.button}>
          {processing ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
    </Page>
  )
}

Subscribe.getInitialProps = async () => {
  const subscribeDocument = await client.getSingle('subscribe')
  const subscribedDocument = await client.getSingle('subscribed')
  return { subscribeDocument, subscribedDocument }
}

export default Subscribe
