const { create } = require('xmlbuilder2')
const fs = require('fs')
const Prismic = require('prismic-javascript')
const PrismicDOM = require('prismic-dom')
const { queryAll } = require('../helpers')

const pubDate = (date) => {
  date = new Date(date)

  const pieces = date.toString().split(' '),
    offsetTime = pieces[5].match(/[-+]\d{4}/),
    offset = offsetTime ? offsetTime : pieces[5],
    parts = [pieces[0] + ',', pieces[2], pieces[1], pieces[3], pieces[4], offset]

  return parts.join(' ')
}

async function generateRSS() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    fetch: [
      'sketchplanation.uid',
      'sketchplanation.title',
      'sketchplanation.image',
      'sketchplanation.body',
      'sketchplanation.published_at',
    ],
    orderings: '[my.sketchplanation.published_at desc]',
  })

  const items = sketchplanations.map(
    ({
      uid,
      data: {
        title,
        body,
        published_at,
        image: { url: image_url },
      },
    }) => {
      const url = `https://sketchplanations.com/${uid}`
      const html = `<img src="${image_url}&w=798" />${PrismicDOM.RichText.asHtml(body)}`

      return {
        guid: url,
        title,
        pubDate: pubDate(published_at),
        link: url,
        description: {
          $: html,
        },
      }
    }
  )

  const obj = {
    rss: {
      '@version': '2.0',
      '@xmlns:atom': 'http://www.w3.org/2005/Atom',
      channel: {
        'atom:link': {
          '@href': 'https://sketchplanations.com/rss',
          '@rel': 'self',
          '@type': 'application/rss+xml',
        },
        title: 'Sketchplanations',
        link: 'https://sketchplanations.com/',
        description: 'Explaining one thing a week in a sketch',
        item: items,
      },
    },
  }

  const doc = create({ encoding: 'UTF-8' }, obj)
  const xml = doc.end()
  fs.writeFileSync('public/rss', xml)
}

generateRSS()
