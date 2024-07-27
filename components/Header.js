import classNames from 'classnames'
import { Menu } from 'lucide-react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import styles from './Header.module.css'

import Navigation from 'components/Navigation'
import { isBlank } from 'helpers'
import useSearch from 'hooks/useSearch'

import SearchForm from './SearchForm'
import SketchplanationsGrid from './SketchplanationsGrid'

// import Tags from './Tags'

// const LogoPicture = () => (
//   <picture>
//     <source srcSet='/logo.svg 100w' media='(max-width: 767px)' />
//     <source srcSet='/logo-small.svg 100w' media='(min-width: 768px) and (max-width: 1023px)' />
//     <source srcSet='/logo.svg 100w' media='(min-width: 1024px)' />
//     <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
//   </picture>
// )

const Header = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { query, setQuery, reset, results, busy } = useSearch()

  useEffect(() => {
    if (isSearching || isBlank(query)) return undefined

    setIsSearching(true)
  }, [query])

  const [randomHandle, setRandomHandle] = useState(null)

  useEffect(() => {
    const fetchRandomHandle = async () => {
      try {
        const res = await fetch('/api/random')
        const { handle } = await res.json()
        setRandomHandle(handle)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRandomHandle()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const exitSearch = () => {
    if (!isSearching) return

    setQuery('')
    setIsSearching(false)
  }

  useHotkeys('escape', exitSearch, {}, [isSearching])

  return (
    <>
      <div className={classNames(styles.root, isOpen && styles['root-open'])}>
        <div className={styles.divider} />
        <div className={classNames(styles['ident-and-search'], isOpen && styles['ident-and-search-open'])}>
          <button className={styles.menu} onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </button>
          {router.pathname === '/' ? (
            <div onClick={scrollToTop} className={styles.ident} style={{ cursor: 'pointer' }}>
              {/* <LogoPicture /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
            </div>
          ) : (
            <Link href='/' className={styles.ident}>
              {/* <LogoPicture /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
            </Link>
          )}
          <button className={styles['search-toggle']} onClick={() => setIsSearching(true)}>
            <span className={styles['search-toggle__icon']}>
              <Search strokeWidth={1} size={22} />
            </span>
            <span className={styles['search-toggle__text']}>Search…</span>
          </button>
        </div>
        <div className={classNames(styles.main, isOpen && styles['main-open'])}>
          <div className={styles['search-form']}>
            <SearchForm isBusy={busy} value={query} onChange={setQuery} onReset={reset} />
          </div>
          <Navigation />
        </div>
      </div>

      {isSearching && (
        <div className={styles['search-overlay']}>
          <div className={styles['search-header']}>
            <div className='flex items-center gap-3'>
              <div className='flex-grow'>
                <SearchForm
                  isBusy={busy}
                  value={query}
                  onChange={setQuery}
                  onReset={reset}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      exitSearch()
                    }
                  }}
                  autoFocus
                />
              </div>
              <button className={styles.item} onClick={exitSearch}>
                {/* <ChevronLeft /> */}
                Cancel
              </button>
              {/* <button className='inline-block w-auto p-2 bg-white rounded-full' onClick={exitSearch}>
                <X className='text-bg' />
              </button> */}
            </div>
            {/* <div className={styles.links}>
              <Link href='/tags' className={styles.link}>
                Categories
              </Link>
              <Link href='/archive' className={styles.link}>
                Archive
              </Link>
            </div> */}
          </div>
          <div className={styles['search-results']}>
            {/* {tagResults && <Tags tags={tagResults} />} */}
            <div className={styles.gallery}>
              {results && results.length > 0 && (
                <div className={styles['search-results-count']}>
                  {results.length} sketch{results.length === 1 ? '' : 'es'} found
                </div>
              )}
              {results && results.length === 0 && (
                <div className={styles['search-results-empty']}>
                  <p>No sketches found</p>
                  <Link href={`/${randomHandle}`} className={!randomHandle && 'invisible'}>
                    Try something random
                  </Link>
                </div>
              )}
              <SketchplanationsGrid prismicDocs={results} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
