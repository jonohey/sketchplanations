import { useEffect, useState } from 'react'

import { client } from 'services/prismic'
import { Page } from 'components'
import Modal from 'components/Modal'

const SubscribeModal = ({ show, onHide = () => {} }) => {
  const [subscribeModalDocument, setSubscribeModalDocument] = useState(null)
  const [subscribedModalDocument, setSubscribedModalDocument] = useState(null)

  useEffect(() => {
    const fetchSubscribeModal = async () => {
      const doc = await client.getSingle('subscribe_modal')
      setSubscribeModalDocument(doc)
    }

    fetchSubscribeModal()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const doc = await client.getSingle('subscribed')
    setSubscribedModalDocument(doc)
  }

  return (
    <>
      <Modal show={show} onHide={onHide}>
        {subscribedModalDocument && <Page document={subscribedModalDocument} inline={true} />}
        {!subscribedModalDocument && subscribeModalDocument && <Page document={subscribeModalDocument} inline={true} />}
        {!subscribedModalDocument && (
          <form className='form' onSubmit={handleSubmit}>
            <input
              className='input'
              type='email'
              required
              placeholder='Email address'
              autoFocus
              autoComplete='email'
              pattern='.+@.+'
            />
            <button className='button' type='submit'>
              Subscribe
            </button>
          </form>
        )}
      </Modal>
      <style jsx>{`
        .form {
          @apply p-6 flex;
        }

        .input {
          @apply flex-grow p-3 rounded-l bg-inputBg border border-inputBorder border-r-0 outline-none;
        }

        .button {
          @apply bg-brightRed text-white p-3 rounded-r;
        }
      `}</style>
    </>
  )
}

export default SubscribeModal
