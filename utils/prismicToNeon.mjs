import { createClient } from '@prismicio/client'
import postgres from 'postgres'

const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

const client = createClient(apiEndpoint)

const sql = postgres({
  ssl: {
    rejectUnauthorized: true,
    require: true,
  },
})

const prismicToNeon = async () => {
  const docs = await client.getAllByType('sketchplanation', {
    fetch: ['sketchplanation.id', 'sketchplanation.uid', 'sketchplanation.title'],
  })

  const sketchplanations = docs.map(({ id, uid, data: { title } }) => ({
    id,
    handle: uid,
    title,
  }))

  await sql`INSERT INTO sketchplanations ${sql(
    sketchplanations
  )} ON CONFLICT (id) DO UPDATE SET handle = EXCLUDED.handle, title = EXCLUDED.title`
}

export default prismicToNeon
