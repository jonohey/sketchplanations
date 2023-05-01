import postgres from 'postgres'

const sql = postgres({
  ssl: {
    rejectUnauthorized: true,
    require: true,
  },
})

export default async (req, res) => {
  // Verify secret parameter exists
  if (!req.query.secret) {
    return res.status(401).send('Unauthorized')
  }

  // Verify secret parameter is correct
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized')
  }

  const result = await sql`SELECT * FROM sketchplanations ORDER BY RANDOM() LIMIT 1`

  res.redirect(`/${result[0].handle}`)
}
