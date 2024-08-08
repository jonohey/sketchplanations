import fs from 'fs'
import path from 'path'

import { client } from '../services/prismic.mjs'

async function buildInitialSearchResults() {
  const results = await client.getAllByType('sketchplanation', {
    orderings: [
      {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
    ],
    limit: 20,
  })

  const filePath = path.join(process.cwd(), 'initial-search-results.json')
  fs.writeFileSync(filePath, JSON.stringify(results))
}

export default buildInitialSearchResults
