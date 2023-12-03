import * as prismic from '@prismicio/client'
import { complement, either, isEmpty, isNil } from 'ramda'

import { client } from 'services/prismic'

const defaultPageTitle = 'Sketchplanations - A weekly explanation in a sketch'

const fulltextDocumentSearch = async (documentType, query) => {
  if (!query || query === '') return []

  const { results } = await client.get({
    filters: [prismic.filter.at('document.type', documentType), prismic.filter.fulltext('document', query)],
    pageSize: 100,
  })

  return results
}

export const searchSketchplanations = async (query) => {
  if (!query || query === '') return []

  const { results: titleResults } = await client.get({
    filters: [
      prismic.filter.at('document.type', 'sketchplanation'),
      prismic.filter.fulltext('my.sketchplanation.title', query),
    ],
    pageSize: 100,
  })

  const documentResults = await fulltextDocumentSearch('sketchplanation', query)

  // Combine the results and remove duplicates
  const results = [...titleResults, ...documentResults].reduce((acc, result) => {
    const existingResult = acc.find((r) => r.id === result.id)

    if (!existingResult) {
      acc.push(result)
    }

    return acc
  }, [])

  return results
}

export const searchTags = async (query) => await fulltextDocumentSearch('tag', query)

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
