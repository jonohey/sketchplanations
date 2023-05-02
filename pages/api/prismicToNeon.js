import prismicToNeon from 'utils/prismicToNeon.mjs'

export default async (req, res) => {
  // Verify secret parameter exists
  if (!req.query.secret) {
    return res.status(401).send('Unauthorized')
  }

  // Verify secret parameter is correct
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized')
  }

  await prismicToNeon()

  res.status(200).json({})
}
