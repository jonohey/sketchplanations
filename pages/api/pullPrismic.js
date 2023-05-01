import postgres from 'postgres'

const { createClient } = require('@prismicio/client')
const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

const client = createClient(apiEndpoint)

const sql = postgres({
  ssl: {
    rejectUnauthorized: true,
    require: true,
  },
})

export default async (req, res) => {
  const docs = await client.getAllByType('sketchplanation')

  const sketchplanations = docs.map(({ id, uid, data: { title } }) => ({
    id,
    handle: uid,
    title,
  }))

  await sql`INSERT INTO sketchplanations ${sql(
    sketchplanations
  )} ON CONFLICT (id) DO UPDATE SET handle = EXCLUDED.handle, title = EXCLUDED.title`

  res.status(200).json({})
}
