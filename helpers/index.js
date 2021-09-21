import { Predicates, client } from 'services/prismic'

const defaultPageTitle = 'Sketchplanations - A weekly explanation in a sketch'

const search = async (documentType, query) => {
  if (!query || query === '') return []

  const { results } = await client.query(
    [Predicates.at('document.type', documentType), Predicates.fulltext('document', query)],
    { pageSize: 100 }
  )

  return results
}

export const searchSketchplanations = async (query) => await search('sketchplanation', query)

export const searchTags = async (query) => await search('tag', query)

export const queryAll = async (predicates, options = {}) => {
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

export const pageTitle = (title) => {
  if (!title) return defaultPageTitle

  return `${title} - Sketchplanations`
}
