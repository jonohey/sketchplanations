import fs from 'fs'
import path from 'path'

const randomArrayItem = (array) => array[Math.floor(Math.random() * array.length)]

const getUids = () => {
  const filepath = path.join(process.cwd(), 'data/uids.json')
  return fs.readFileSync(filepath)
}

export default async (req, res) => {
  const uids = JSON.parse(getUids())

  res.redirect(`/${randomArrayItem(uids)}`)
}
