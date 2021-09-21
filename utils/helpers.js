const { client } = require('../services/prismic')

exports.queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const documents = []

  do {
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
