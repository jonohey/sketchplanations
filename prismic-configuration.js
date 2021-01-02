import Prismic from '@prismicio/client'

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = 'https://sketchplanations.prismic.io/api/v2'

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
// export const accessToken = ''

// -- Link resolution rules
// Manages links to internal Prismic documents
// Modify as your project grows to handle any new routes you've made
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

// -- Client method to query Prismic
// Connects to the given repository to facilitate data queries
// export const client = Prismic.client(apiEndpoint, { accessToken })
export const client = Prismic.client(apiEndpoint)
