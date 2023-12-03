import { createClient } from '@prismicio/client'

export const linkResolver = (doc) => {
  if (doc.type === 'sketchplanation') {
    return `/${doc.uid}`
  } else if (doc.type === 'about') {
    return '/about'
  } else if (doc.type === 'licence') {
    return '/licence'
  } else if (doc.type === 'thanks') {
    return '/thanks'
  } else if (doc.type === 'privacy') {
    return '/privacy'
  } else if (doc.type === 'wisdom') {
    return '/wisdom'
  }
  return '/'
}

// Additional helper function for Next/Link components
export const hrefResolver = (doc) => {
  if (doc.type === 'sketchplanation') {
    return `/post?uid=${doc.uid}`
  }
  return '/'
}

export const client = createClient('sketchplanations')
