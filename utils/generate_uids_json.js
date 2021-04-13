const fs = require('fs')
const path = require('path')
const Prismic = require('prismic-javascript')
const PrismicDOM = require('prismic-dom')
const { queryAll } = require('../helpers')

async function generateUidsJson() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    fetch: ['sketchplanation.uid'],
  })

  const uids = sketchplanations.map((doc) => doc.uid)

  const filepath = path.join(process.cwd(), '/publi/uids.json')
  console.log('filepath', filepath)
  fs.writeFileSync(filepath, JSON.stringify(uids))
}

module.exports = generateUidsJson
