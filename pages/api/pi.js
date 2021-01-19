const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const { sketchplanationTitle, customerEmail, amount } = req.body
  const amountFractional = parseFloat(amount) * 100

  const piAttrs = {
    amount: amountFractional,
    currency: 'gbp',
    description: ['PWYW', sketchplanationTitle, customerEmail].filter((x) => x && x !== '').join(' - '),
    metadata: {
      'Sketchplanation title': sketchplanationTitle,
      'Customer email': customerEmail,
    },
  }

  if (customerEmail && customerEmail !== '') piAttrs.receipt_email = customerEmail

  const paymentIntent = await stripe.paymentIntents.create(piAttrs)

  res.json({ clientSecret: paymentIntent.client_secret })
}
