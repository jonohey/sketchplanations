import React, { useState } from 'react'
import Link from 'next/link'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import CurrencyInput from 'react-currency-input-field'

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      fontWeight: 500,
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#A3AEBE',
      },
    },
  },
}

const presetAmounts = [2, 5, 10, 20, 50, 100, null]

const PayWhatYouWant = ({ sketchplanationUid }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [free, setFree] = useState(false)
  const [amount, setAmount] = useState(20)
  const [customAmount, setCustomAmount] = useState(null)
  const [error, setError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const stripeAmount = parseFloat(customAmount || amount)

    if (isNaN(stripeAmount)) return alert('Oops, did you name your own price?')
    if (stripeAmount < 0.3) return alert('Sorry, the amount must be at least £0.30')

    if (!stripe || !elements) return
    if (error) return elements.getElement('card').focus()
    if (cardComplete) setProcessing(true)

    const cardElement = elements.getElement(CardElement)

    const response = await fetch(`/api/pi?amount=${stripeAmount}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    try {
      const payload = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      setProcessing(false)

      if (payload.error) {
        setError(payload.error)
      } else {
        setPaymentIntent(payload.paymentIntent)
      }
    } catch (e) {
      setProcessing(false)
      console.error(e)
    }
  }

  const handleCardElementChange = (e) => {
    setError(e.error)
    setCardComplete(e.complete)
  }

  return (
    <>
      <div>
        <h2>Download high-quality image</h2>
        {free || paymentIntent ? (
          <>
            <p>Thank you. You can download the high-quality image using the following link:</p>
            <p>
              <a href={`/api/dl?uid=${sketchplanationUid}`} download rel='noreferrer' target='_blank'>
                https://sketchplanations.com/api/dl?uid={sketchplanationUid}
              </a>
            </p>
          </>
        ) : (
          <>
            <p>
              You’re free to use sketchplanations in your articles or presentations as you wish. Please spread the word!
              (see{' '}
              <Link href='/licence'>
                <a>licence</a>
              </Link>
              ) If it’s useful to you please consider paying a small amount to help keep it going.
            </p>
            <p>Jono</p>
            <form className='form' onSubmit={handleSubmit}>
              <div>{error && error.message}</div>
              <div>
                <div className='amount-options'>
                  {presetAmounts.map((presetAmount) => (
                    <label key={presetAmount}>
                      <input
                        type='radio'
                        name='amount'
                        value={amount}
                        checked={presetAmount === amount}
                        onChange={() => setAmount(presetAmount)}
                      />
                      <span>{presetAmount ? `£${presetAmount}` : 'Other'}</span>
                    </label>
                  ))}
                </div>
              </div>
              {!amount && (
                <div>
                  <div className='amount-input'>
                    <CurrencyInput
                      prefix='£'
                      placeholder='Name your own price (min. £0.30)'
                      defaultValue={customAmount || ''}
                      allowDecimals={true}
                      decimalsLimit={2}
                      allowNegativeValue={false}
                      turnOffAbbreviations={true}
                      onChange={(value) => setCustomAmount(value)}
                    />
                  </div>
                </div>
              )}
              <div>
                <div className='cardInput'>
                  <CardElement options={CARD_OPTIONS} onChange={handleCardElementChange} />
                </div>
              </div>
              <div>
                <button className='pay-button' type='submit' disabled={processing || !stripe}>
                  {processing ? 'Processing…' : 'Pay and download'}
                </button>
                <button className='free-button' type='button' onClick={() => setFree(true)}>
                  Download for free
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <style jsx>
        {`
          h2 {
            @apply m-0 mb-3 text-lg;
          }

          p + p {
            @apply mt-2;
          }

          a {
            @apply text-bright-red;
          }

          .form {
            @apply -m-2;
          }

          .form :global(> *) {
            @apply p-2;
          }

          .amount-input :global(input),
          .cardInput :global(.StripeElement) {
            @apply block py-2 px-4 w-full bg-white rounded border outline-none;
          }

          .amount-input :global(input:focus),
          .cardInput :global(.StripeElement--focus) {
            @apply border-blue;
          }

          .pay-button {
            @apply block mt-3 py-2 px-4 w-full bg-blue text-white rounded;
          }

          .free-button {
            @apply block mt-4 py-2 px-4 w-full rounded;
            color: #777;
            border: solid 1px #eee;
          }

          .amount-options {
            @apply flex flex-wrap justify-center -m-1 mt-0;
          }

          label {
            @apply relative p-1;
          }

          @screen sm {
            label {
              @apply flex-grow;
            }
          }

          label > input {
            @apply absolute top-0 left-0 w-full h-full appearance-none opacity-0;
          }

          label > span {
            @apply block text-center py-2 px-4 bg-white rounded border;
          }

          label > input:checked + span {
            @apply bg-bright-red text-white border-bright-red;
          }
        `}
      </style>
    </>
  )
}

export default PayWhatYouWant
