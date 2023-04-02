import { client } from 'services/prismic'

import SketchplanationsGrid from 'components/SketchplanationsGrid'

const Archive = ({ sketchplanations }) => {
  return <SketchplanationsGrid prismicDocs={sketchplanations} />
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
