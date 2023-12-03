import { useEffect, useState } from 'react'
import { PrismicRichText } from '@prismicio/react'
import TagManager from 'react-gtm-module'

import { setCookie } from 'helpers'
import { client, linkResolver } from 'services/prismic'

import styles from './SubscribeInline.module.css'

const SubscribeInline = () => {
  const [doc, setDoc] = useState(null)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const fetchDoc = async () => {
      setDoc(await client.getSingle('subscribe_inline'))
    }

    fetchDoc()
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

    try {
      TagManager.dataLayer({
        dataLayer: {
          event: 'subscribe',
          data: 'inline',
        },
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
          <PrismicRichText field={doc?.data?.['post-submit']} linkResolver={linkResolver} />
        </div>
      ) : (
        <>
          <div className='prose mb-6'>
            <PrismicRichText field={doc?.data?.['pre-submit']} linkResolver={linkResolver} />
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
