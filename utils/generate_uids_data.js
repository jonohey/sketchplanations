const fs = require('fs')
const { client } = require('./helpers')

async function generateUidsData() {
  const sketchplanations = await client.getAllByType('sketchplanation', {
    fetch: ['sketchplanation.uid'],
  })

  const uids = sketchplanations.map((doc) => doc.uid)

  fs.writeFileSync('data/uids.json', JSON.stringify(uids))
}

generateUidsData()
