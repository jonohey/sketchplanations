const defaultPageTitle = 'Sketchplanations - A weekly explanation in a sketch'

exports.pageTitle = (title) => {
  if (!title) return defaultPageTitle

  return `${title} - Sketchplanations`
}

const Prismic = require('prismic-javascript')
const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

exports.queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const documents = []

  do {
    const client = await Prismic.api(apiEndpoint)
    let response = await client.query(predicates, {
      ...options,
      pageSize: 100,
      page,
    })
    documents.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return documents
}
