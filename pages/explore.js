import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Gallery from 'react-photo-gallery'
import Link from 'next/link'

import { Predicates } from 'services/prismic'
import { queryAll, isBlank, searchSketchplanations, searchTags, isPresent } from 'helpers'
import useDebouncedValue from 'hooks/useDebouncedValue'
import SearchForm from 'components/SearchForm'
import SketchplanationGalleryPhoto from 'components/SketchplanationGalleryPhoto'
import Tags from 'components/Tags'
import useGalleryPhotos from 'hooks/useGalleryPhotos'

const Explore = ({ initialSketchplanations }) => {
  const router = useRouter()
  const { query, isReady } = router

  const [searchQuery, setSearchQuery] = useState(query?.q)
  const [sketchplanationResults, setSketchplanationResults] = useState(null)
  const [tagResults, setTagResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500)

  const photos = useGalleryPhotos(sketchplanationResults || initialSketchplanations)

  useEffect(() => {
    if (!isReady) return

    setIsSearching(isPresent(query?.q))
    setSearchQuery(query?.q || '')
  }, [isReady])

  useEffect(() => {
    if (!isReady) return

    if (isBlank(debouncedSearchQuery)) {
      setSketchplanationResults(null)
      setTagResults(null)

      return router.replace({
        pathname: '/explore',
      })
    }

    if (query.q !== debouncedSearchQuery)
      router.replace({
        pathname: '/explore',
        query: { q: encodeURI(debouncedSearchQuery) },
      })

    const search = async () => {
      setIsSearching(true)
      setSketchplanationResults(await searchSketchplanations(debouncedSearchQuery))
      setTagResults(await searchTags(debouncedSearchQuery))
      setIsSearching(false)
    }

    search()
  }, [debouncedSearchQuery])

  return (
    <>
      <div className='root'>
        <SearchForm
          isBusy={isSearching}
          value={searchQuery}
          onChange={setSearchQuery}
          onReset={() => setSearchQuery('')}
        />
        <div className='links'>
          <Link href='/api/random'>
            <a>Random</a>
          </Link>
          <Link href='/tags'>
            <a>Explore by tag</a>
          </Link>
        </div>
        <Tags tags={tagResults} />
        <div className='gallery'>
          {isReady && !isSearching && (
            <Gallery
              photos={photos}
              direction='row'
              margin={16}
              targetRowHeight={400}
              renderImage={SketchplanationGalleryPhoto}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .root {
          @apply pt-8 pb-20 mx-auto;
        }

        .gallery {
          @apply overflow-hidden;
        }

        .gallery :global(.react-photo-gallery--gallery) {
          margin: -16px;
        }

        @screen sm {
          .gallery :global(.react-photo-gallery--gallery) {
            margin: 16px;
          }
        }

        .links {
          @apply grid grid-flow-col-dense gap-x-6 justify-center px-6 mb-6;
        }

        @screen sm {
          .links {
            @apply mb-0;
          }
        }

        .links a {
          @apply text-blue;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const initialSketchplanations = await queryAll(Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  return { props: { initialSketchplanations: initialSketchplanations.slice(0, 20) } }
}

export default Explore
