const stripe = require('stripe')(
  'sk_test_51HHbylFCZUVebsQFLWH2yzmr25p8QphCk66uM8UP9uz66VssDniTrvN7TfcRHvVyMjyL8PPTU2N8KJv9stoTBxbP001KKPzudF'
)

export default async (req, res) => {
  const amount = parseFloat(req.query.amount) * 100

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
  })

  res.json({ clientSecret: paymentIntent.client_secret })
}
