import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import { Sketchplanation } from 'components'

const Home = ({ sketchplanations }) => {
  return (
    <div className='sketchplanations-wrapper'>
      <div className='masthead'>
        <img src='/logo.svg' alt='Sketchplanations' />
        <p className='sm:text-lg'>Explaining one thing a week in a sketch</p>
        <nav className='whitespace-no-wrap'>
          <a href='/about'>About</a>
          <a href='/archive'>Archive</a>
          <a href='https://www.patreon.com/sketchplanations'>Patreon</a>
          <a href='https://sketchplanations.us7.list-manage.com/subscribe?u=9cb0e0c4f7192ab482322d4f9&id=a5a82e1a38'>Subscribe</a>
        </nav>
      </div>
      <div className='sketchplanations'>
        {sketchplanations.results.map((sketchplanation) => (
          <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
        ))}
      </div>
      <style jsx>{`
        nav a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async () => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 100,
  })

  return { sketchplanations }
}

export default Home
