import { kv } from '@vercel/kv'

export default async (req, res) => {
  const handle = await kv.srandmember('sketchplanations')

  res.status(200).json({ handle })
}
