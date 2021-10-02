import { either, isEmpty, isNil, complement } from 'ramda'

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

export const isBlank = either(isEmpty, isNil)

export const isPresent = complement(isBlank)

export const setCookie = (name, value, days) => {
  let expires = ''

  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toGMTString()
  }

  document.cookie = name + '=' + value + expires + '; path=/'
}

export const getCookie = (name) => {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
