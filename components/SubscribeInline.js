import { sendGTMEvent } from 'gtm'
import { useState } from 'react'

import styles from './SubscribeInline.module.css'

import { setCookie } from 'helpers'

import RichText from './RichText'

const SubscribeInline = ({ doc }) => {
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

    try {
      sendGTMEvent({
        event: 'subscribe',
        data: 'inline',
      })
    } catch (e) {} // eslint-disable-line no-empty

    setSubmitted(true)
    setProcessing(false)

    setCookie('mjPopinShown', true)
  }

  return (
    <div className={styles.root}>
      {submitted ? (
        <div className='prose'>
          <RichText field={doc?.data?.['post-submit']} />
        </div>
      ) : (
        <>
          <div className='prose mb-6'>
            <RichText field={doc?.data?.['pre-submit']} />
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type='email'
              required
              placeholder='Email address'
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
    </div>
  )
}

export default SubscribeInline
