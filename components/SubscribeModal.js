import { useEffect, useState } from 'react'

import { setCookie } from 'helpers'
import { client } from 'services/prismic'
import { Page } from 'components'
import Modal from 'components/Modal'

import styles from './SubscribeModal.module.css'

const SubscribeModal = ({ show, onHide = () => {} }) => {
  const [subscribeModalDocument, setSubscribeModalDocument] = useState(null)
  const [subscribedModalDocument, setSubscribedModalDocument] = useState(null)

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchSubscribeModal = async () => {
      const doc = await client.getSingle('subscribe_modal')
      setSubscribeModalDocument(doc)
    }

    fetchSubscribeModal()
  }, [])

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

    const doc = await client.getSingle('subscribed')
    setSubscribedModalDocument(doc)

    setSubmitted(true)
    setProcessing(false)

    setCookie('mjPopinShown', true)
  }

  return (
    <Modal show={show} onHide={onHide}>
      {submitted && subscribedModalDocument ? (
        <Page document={subscribedModalDocument} inline={true} />
      ) : (
        <>
          {subscribeModalDocument && <Page document={subscribeModalDocument} inline={true} />}
          <form className={styles.form} onSubmit={handleSubmit}>
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
        </>
      )}
    </Modal>
  )
}

export default SubscribeModal
