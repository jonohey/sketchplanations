import Link from 'next/link'
import { useRouter } from 'next/router'

import styles from './Header.module.css'

import Navigation from 'components/Navigation'

const LogoPicture = () => (
  <picture>
    <source srcSet='/logo-small.svg 100w' media='(max-width: 549px)' />
    <source srcSet='/logo.svg 100w' media='(min-width: 550px)' />
    <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
  </picture>
)

const Header = () => {
  const router = useRouter()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <div className={styles.root}>
      {router.pathname === '/' ? (
        <div onClick={scrollToTop} className={styles.ident} style={{ cursor: 'pointer' }}>
          <LogoPicture />
        </div>
      ) : (
        <Link href='/' className={styles.ident}>
          <LogoPicture />
        </Link>
      )}
      <Navigation />
    </div>
  )
}

export default Header
