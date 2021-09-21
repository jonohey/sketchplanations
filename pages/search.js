import { useRouter } from 'next/router'
import Gallery from 'react-photo-gallery'
import Imgix from 'react-imgix'
import Link from 'next/link'
import React, { useState } from 'react'

import { searchSketchplanations, searchTags } from 'helpers'
import { TextHeader } from 'components'

const mapResultsToImages = (results) => {
  try {
    return results.map(
      ({
        uid,
        data: {
          title,
          image: {
            url,
            alt,
            dimensions: { width, height },
          },
        },
      }) => ({
        src: url,
        width,
        height,
        alt: alt || `${title} - Sketchplanations`,
        uid,
      })
    )
  } catch {
    console.log('Something went wrong:', results)
    return []
  }
}

const Search = ({ ssrSketchplanations, ssrTags, ssrSearchCalled }) => {
  const router = useRouter()
  const [searchCalled, setSearchCalled] = useState(ssrSearchCalled)
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState(router?.query?.q || '')
  const [images, setImages] = useState(ssrSketchplanations ? mapResultsToImages(ssrSketchplanations) : [])
  const [tags, setTags] = useState(ssrTags || [])

  const runSearch = async (e) => {
    e.preventDefault()

    if (!query || query === '') return

    setIsSearching(true)

    const sketchplanationsResults = await searchSketchplanations(query)
    const tagsResults = await searchTags(query)

    setSearchCalled(true)
    setImages(mapResultsToImages(sketchplanationsResults))
    setTags(tagsResults)
    setIsSearching(false)

    router.replace({
      pathname: '/search',
      query: { q: query },
    })
  }

  const renderImage = ({ photo }) => {
    return (
      <Link key={photo.uid} href={`/${photo.uid}`}>
        <a>
          <Imgix
            className='lazyload'
            src={photo.src}
            attributeConfig={{
              src: 'data-src',
              srcSet: 'data-srcset',
              sizes: 'data-sizes',
            }}
            htmlAttributes={{
              src: `${photo.src}&w=400&blur=200&px=16`,
              style: { margin: 16, display: 'block' },
              width: photo.width,
              height: photo.height,
            }}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
          />
        </a>
      </Link>
    )
  }

  return (
    <>
      <div className='root'>
        <form className='search-form' onSubmit={runSearch}>
          <input
            className='query-input'
            type='text'
            placeholder='Type to search…'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={true}
          />
          <button className={`submit-button ${query && query !== '' && 'is-active'}`} type='submit'>
            {isSearching ? (
              <svg className='search-loading-icon' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            ) : (
              <svg className='search-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z' />
              </svg>
            )}
          </button>
        </form>
        {searchCalled && (images.length > 0 || tags.length > 0) && (
          <>
            {tags.length > 0 && (
              <div className='tags'>
                <span>Matching tags:</span>
                {tags.map(({ data: { identifier: tag }, slugs }) => (
                  <Link key={tag} href={`/tags/${slugs[0]}`}>
                    <a>{tag}</a>
                  </Link>
                ))}
              </div>
            )}
            <div className='gallery'>
              <Gallery photos={images} direction='row' margin={16} targetRowHeight={400} renderImage={renderImage} />
            </div>
          </>
        )}
        {searchCalled && images.length === 0 && tags.length === 0 && (
          <div className='no-results'>
            <TextHeader className='text-center'>No results</TextHeader>
          </div>
        )}
      </div>
      <style jsx>
        {`
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

          .gallery :global(img) {
            max-width: 570px;
          }

          .gallery :global(.react-photo-gallery--gallery > *) {
            justify-content: center;
          }

          .search-form {
            @apply mx-auto px-3 mb-8 flex flex-row;
            max-width: 28rem;
          }

          @screen sm {
            .search-form {
              @apply mb-0 px-4;
            }
          }

          .query-input {
            @apply block py-2 px-4 w-full bg-white border border-r-0 outline-none flex-grow rounded-lg rounded-r-none;
          }

          @screen sm {
            .query-input {
              @apply py-3 px-6 text-lg rounded-full rounded-r-none;
            }
          }

          .query-input:focus,
          .query-input:focus ~ .submit-button {
            @apply border-blue;
          }

          .submit-button {
            @apply px-4 text-black border border-l-0 rounded-lg rounded-l-none;
          }

          @screen sm {
            .submit-button {
              @apply px-6 rounded-full rounded-l-none;
            }
          }

          .query-input:focus ~ .submit-button.is-active {
            @apply text-blue;
          }

          .submit-button svg {
            width: 1rem;
            height: auto;
          }

          .search-icon {
            fill: currentColor;
            opacity: 0.38;
            transition: opacity 0.2s;
          }

          .query-input:focus ~ .submit-button.is-active > .search-icon {
            opacity: 1;
          }

          .no-results {
            @apply pt-20;
          }

          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .search-loading-icon {
            @apply text-blue;
            animation: spin 1s linear infinite;
          }

          .tags {
            @apply flex flex-wrap justify-center p-6 pb-0;
          }

          .tags > span {
            @apply relative py-2 m-2 rounded-full text-sm;
          }

          @screen sm {
            .tags > span {
              @apply text-base;
            }
          }

          .tags a {
            @apply relative py-2 px-4 m-2 rounded-full border text-sm;
            transition: all 0.1s ease-out;
          }

          @screen sm {
            .tags a {
              @apply text-base;
            }
          }

          .tags b {
            @apply text-xs;
            opacity: 0.5;
          }

          .tags a:hover {
            @apply bg-bright-red text-white border-bright-red shadow;
          }
        `}
      </style>
    </>
  )
}

Search.getInitialProps = async ({ query }) => {
  const ssrSearchCalled = query?.q ? true : false
  const ssrSketchplanations = await searchSketchplanations(query.q)
  const ssrTags = await searchTags(query.q)

  return { ssrSketchplanations, ssrTags, ssrSearchCalled }
}

export default Search
