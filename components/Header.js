import classNames from 'classnames'
import { Menu } from 'lucide-react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { RemoveScroll } from 'react-remove-scroll'

import styles from './Header.module.css'

import Navigation from 'components/Navigation'
import useSearch from 'hooks/useSearch'

const Header = () => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const { isSearchPage } = useSearch()

  const enterSearch = () => {
    router.push('/search', undefined, { shallow: true })
  }

  useHotkeys('/', (e) => {
    e.preventDefault()
    enterSearch()
  })

  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false)

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <RemoveScroll enabled={isOpen}>
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
              <span className={styles['search-toggle-button__text']}>Search…</span>
              <kbd className={styles['search-toggle-button__keyboard-shortcut']}>/</kbd>
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
    </RemoveScroll>
  )
}

export default Header
