import { kv } from '@vercel/kv'
import { client } from '../services/prismic.mjs'

const prismicToKV = async () => {
  if (process.env.VERCEL !== '1') return

  const docs = await client.getAllByType('sketchplanation', {
    fetch: ['sketchplanation.uid'],
  })

  const uids = docs.map(({ uid }) => uid)

  await kv.del('sketchplanations')
  await kv.sadd('sketchplanations', ...uids)
}

export default prismicToKV
