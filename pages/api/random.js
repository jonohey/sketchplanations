import postgres from 'postgres'

const sql = postgres({
  ssl: {
    rejectUnauthorized: true,
    require: true,
  },
})

export default async (req, res) => {
  const result = await sql`SELECT * FROM sketchplanations ORDER BY RANDOM() LIMIT 1`

  res.redirect(`/${result[0].handle}`)
}
