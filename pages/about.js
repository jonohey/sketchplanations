import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const About = ({ document }) => {
  return (
    <>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

About.getInitialProps = async ({ query: { uid } }) => {
  const document = await client.getSingle('about')
  return { document }
}

export default About
