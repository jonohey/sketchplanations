const { create } = require('xmlbuilder2')
const fs = require('fs')
const globby = require('globby')
const Prismic = require('prismic-javascript')
const { queryAll } = require('../helpers')

async function generateSitemap() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    fetch: 'sketchplanation.uid',
    orderings: '[document.last_publication_date]',
  })

  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'), {
    fetch: 'tag.identifier',
    orderings: '[my.tag.identifier]',
  })

  const lastSketchPubDate = new Date(sketchplanations[sketchplanations.length - 1].last_publication_date)

  const pages = await globby([
    'pages/**/*.js',
    '!pages/_*.js',
    '!pages/**/[uid].js',
    '!pages/**/[tag].js',
    '!pages/404.js',
    '!pages/index.js',
    '!pages/preview.js',
    '!pages/subscribed.js',
    '!pages/thanks.js',
  ])

  const urls = []

  // Home page
  urls.push({
    loc: 'https://sketchplanations.com/',
    lastmod: lastSketchPubDate.toISOString(),
    priority: '1.00',
  })

  // Sketchplanations
  sketchplanations.map((sketchplanation) => {
    urls.push({
      loc: `https://sketchplanations.com/${sketchplanation.uid}`,
      lastmod: new Date(sketchplanation.last_publication_date).toISOString(),
      priority: '0.80',
    })
  })

  // Tags
  tags.map((tag) => {
    urls.push({
      loc: `https://sketchplanations.com/tags/${tag.data.identifier}`,
      lastmod: new Date(tag.last_publication_date).toISOString(),
      priority: '0.64',
    })
  })

  // Pages
  pages.map((page) => {
    const path = page.replace('pages', '').replace('.js', '')
    urls.push({
      loc: `https://sketchplanations.com${path}`,
      priority: '0.64',
    })
  })

  const obj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: urls,
    },
  }

  const doc = create({ encoding: 'UTF-8' }, obj)
  const xml = doc.end({ prettyPrint: true })
  fs.writeFileSync('public/sitemap.xml', xml)
}

module.exports = generateSitemap
