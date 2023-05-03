import Head from 'next/head'

import SketchplanationsGrid from 'components/SketchplanationsGrid'
import { client } from 'services/prismic'

const Archive = ({ sketchplanations }) => {
  return (
    <>
      <Head>
        <meta name='description' content='The full scrollable archive of Sketchplanations. Happy scrolling!' />
      </Head>
      <SketchplanationsGrid prismicDocs={sketchplanations} />
    </>
  )
}

export async function getStaticProps() {
  const sketchplanations = await client.getAllByType('sketchplanation', {
    orderings: {
      field: 'my.sketchplanation.published_at',
      direction: 'desc',
    },
  })

  return { props: { sketchplanations } }
}

export default Archive
