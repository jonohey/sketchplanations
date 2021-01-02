const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const amount = parseFloat(req.query.amount) * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
  })

  res.json({ clientSecret: paymentIntent.client_secret })
}
