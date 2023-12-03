import postgres from 'postgres'
import { client } from '../services/prismic.mjs'

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
