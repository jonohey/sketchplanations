import prismicToNeon from 'utils/prismicToNeon.mjs'

export default async (req, res) => {
  await prismicToNeon()

  res.status(200).json({})
}
