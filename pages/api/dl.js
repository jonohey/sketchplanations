const request = require('request')
const { client } = require('utils/helpers')

export default async (req, res) => {
  const uid = req.query.uid
  const sketchplanation = await client.getByUID('sketchplanation', uid, { fetch: 'sketchplanation.image' })

  const imageUrl = sketchplanation.data.image.url.split('?')[0]
  const extension = imageUrl.split('.').pop().toLowerCase()
  const filename = `sketchplanations-${uid}.${extension}`

  res.setHeader('content-disposition', 'attachment; filename=' + filename)
  res.setHeader('X-Robots-Tag', 'noindex')

  try {
    const data = await request.get(imageUrl)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
}
