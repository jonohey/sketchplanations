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

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sketchplanations.com/</loc>
    <lastmod>${lastSketchPubDate.toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>
${sketchplanations
  .map((sketchplanation) => {
    return `
  <url>
    <loc>${`https://sketchplanations.com/${sketchplanation.uid}`}</loc>
    <lastmod>${new Date(sketchplanation.last_publication_date).toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>`
  })
  .join('')}
${tags
  .map((tag) => {
    return `
  <url>
    <loc>${`https://sketchplanations.com/tags/${tag.data.identifier}`}</loc>
    <lastmod>${new Date(tag.last_publication_date).toISOString()}</lastmod>
    <priority>0.64</priority>
  </url>`
  })
  .join('')}
${pages
  .map((page) => {
    const path = page.replace('pages', '').replace('.js', '')
    return `
  <url>
    <loc>${`https://sketchplanations.com${path}`}</loc>
    <priority>0.64</priority>
  </url>`
  })
  .join('')}
</urlset>`

  fs.writeFileSync('public/sitemap.xml', sitemap)
}

generateSitemap()
