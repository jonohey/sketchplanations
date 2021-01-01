const http = require('http')
const Prismic = require('@prismicio/client')
export const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

const initApi = (req) => {
  return Prismic.getApi(apiEndpoint, {
    req: req,
  })
}

export default async (req, res) => {
  const uid = req.query.uid
  const api = await initApi(req)
  const sketchplanation = await api.getByUID('sketchplanation', uid, { fetch: 'sketchplanation.image' })

  const imageUrl = sketchplanation.data.image.url.split('?')[0]
  const extension = imageUrl.split('.').pop().toLowerCase()
  const filename = `sketchplanations-${uid}.${extension}`

  res.setHeader('content-disposition', 'attachment; filename=' + filename)

  try {
    const data = await http.get(imageUrl)
    res.send(data)
  } catch (e) {
    res.status(404)
  }
}
