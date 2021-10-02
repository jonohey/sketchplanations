const mailjet = require('node-mailjet')

export default async (req, res) => {
  if (req.method !== 'POST') return res.json({ result: 'OK' })

  const email = req.body.email.trim()

  const client = mailjet.connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

  res.setHeader('X-Robots-Tag', 'noindex')

  try {
    await client.post('contactslist').id(36828).action('managecontact').request({
      Email: email,
      Action: 'addforce',
    })

    res.json({ subscribed: true })
  } catch (e) {
    console.log(e)
    res.json({ subscribed: false })
  }
}
