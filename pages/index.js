import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Home = ({ sketchplanations }) => {
  return (
    <div className='sketchplanations-wrapper'>
      <div className='masthead'>
        <img src='/logo.svg' alt='Sketchplanations' />
        <p className='sm:text-lg'>Explaining one thing a week in a sketch</p>
        <nav className='whitespace-no-wrap'>
          <a href='/about'>About</a>
          <a href='/archive'>Archive</a>
          <a href=''>Patreon</a>
          <a href=''>Subscribe</a>
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

Home.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 100,
  })

  return { sketchplanations }
}

export default Home
