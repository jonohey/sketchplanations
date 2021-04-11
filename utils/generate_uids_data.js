const fs = require('fs')
const Prismic = require('prismic-javascript')
const PrismicDOM = require('prismic-dom')
const { queryAll } = require('../helpers')

async function generateUidsData() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    fetch: ['sketchplanation.uid'],
  })

  const uids = sketchplanations.map((doc) => doc.uid)

  fs.writeFileSync('data/uids.json', JSON.stringify(uids))
}

generateUidsData()
