import classNames from 'classnames'
import { Menu } from 'lucide-react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import styles from './Header.module.css'

import Navigation from 'components/Navigation'
import { isPresent } from 'helpers'
import useSearch from 'hooks/useSearch'

import SearchForm from './SearchForm'
import SearchResults from './SearchResults'

const Header = () => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const { query, setQuery, reset, busy, isSearchPage } = useSearch()

  const enterSearch = () => {
    setIsSearching(true)
  }

  useHotkeys('/', (e) => {
    e.preventDefault()
    enterSearch()
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const exitSearch = () => {
    if (!isSearching) return

    reset()
    setIsSearching(false)
  }

  useHotkeys('escape', exitSearch, {}, [isSearching])

  return (
    <>
      <div className={classNames(styles.root, isOpen && styles['root--is-open'])}>
        <button className={styles.menu} onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </button>
        {router.pathname === '/' ? (
          <div onClick={scrollToTop} className={styles.ident} style={{ cursor: 'pointer' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
          </div>
        ) : (
          <Link href='/' className={styles.ident}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
          </Link>
        )}
        <div className={styles['search-toggle']}>
          {!isSearchPage && (
            <button className={styles['search-toggle-button']} onClick={enterSearch}>
              <span className={styles['search-toggle-button__icon']}>
                <Search strokeWidth={1} size={22} />
              </span>
              <span className={styles['search-toggle-button__text']}>{isPresent(query) ? query : 'Search…'}</span>
            </button>
          )}
        </div>
        <div className={classNames(styles.navigation, isOpen && styles['navigation--is-open'])}>
          <Navigation />
        </div>
        <div className={styles.divider} />
        <div className={styles['spacer-left']} />
        <div className={styles['spacer-right']} />
      </div>

      {isSearching && (
        <div className={classNames(styles['search-overlay'], isSearchPage && styles['search-overlay--search-page'])}>
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
              <button className={styles.cancel} onClick={exitSearch}>
                Cancel
              </button>
            </div>
          </div>
          <div className={classNames(styles['search-main'], isSearchPage && styles['search-main--hidden'])}>
            <SearchResults />
          </div>
        </div>
      )}
    </>
  )
}

export default Header
