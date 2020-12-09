import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import CurrencyInput, { formatValue } from 'react-currency-input-field'

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

const PayWhatYouWant = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [amount, setAmount] = useState(2)
  const [error, setError] = useState(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) return
    if (error) return elements.getElement('card').focus()
    if (cardComplete) setProcessing(true)

    const cardElement = elements.getElement(CardElement)

    const response = await fetch('/api/pi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    console.log('data.clientSecret', data.clientSecret)

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
  }

  const handleCardElementChange = (e) => {
    setError(e.error)
    setCardComplete(e.complete)
  }

  return (
    <>
      <div>
        {/* <h2>Pay what you want 🙂</h2> */}
        <p>
          If you’d like to use this sketchplanation in a presentation, on your website, to download and print out etc.
          you can download the high-res file here. Payment is optional but is greatly appreciated. Thank you! 🙂
        </p>
        {paymentIntent ? (
          <pre>{JSON.stringify(paymentIntent, null, 2)}</pre>
        ) : (
          <form className='form' onSubmit={handleSubmit}>
            <div>{error && error.message}</div>
            <div>
              <div className='amountInput'>
                <CurrencyInput
                  prefix='£'
                  placeholder='e.g. £2'
                  defaultValue={amount}
                  allowDecimals={true}
                  decimalsLimit={2}
                  allowNegativeValue={false}
                  turnOffAbbreviations={true}
                  onChange={(value) => setAmount(value)}
                />
              </div>
            </div>
            <div>
              <div className='cardInput'>
                <CardElement options={CARD_OPTIONS} onChange={handleCardElementChange} />
              </div>
            </div>
            <div>
              <button className='payButton' type='submit' disabled={processing || !stripe}>
                {processing
                  ? 'Processing…'
                  : `Download high-res file for ${formatValue({ value: amount, prefix: '£' })}`}
              </button>
              <button className='freeButton' type='button'>
                No thanks, I just want to download it
              </button>
            </div>
          </form>
        )}
      </div>
      <style jsx>
        {`
          h2 {
            @apply m-0 mb-2 text-lg;
          }

          .form {
            @apply -m-2;
          }

          .form :global(> *) {
            @apply p-2;
          }

          .amountInput :global(input),
          .cardInput :global(.StripeElement) {
            @apply block py-2 px-4 w-full bg-white rounded border outline-none;
          }

          .amountInput :global(input:focus),
          .cardInput :global(.StripeElement--focus) {
            @apply border-blue;
          }

          .payButton {
            @apply block py-2 px-4 w-full bg-blue text-white rounded;
          }

          .freeButton {
            @apply block mt-4 w-full text-sm;
          }
        `}
      </style>
    </>
  )
}

export default PayWhatYouWant
