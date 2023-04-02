import Link from 'next/link'
import Navigation from 'components/Navigation'

import styles from './Header.module.css'

const Header = () => {
  return (
    <div className={styles.root}>
      <Link href='/' className={styles.ident}>

        <picture>
          <source srcSet='/logo-small.svg 100w' media='(max-width: 549px)' />
          <source srcSet='/logo.svg 100w' media='(min-width: 550px)' />
          <img src='/logo.svg' className={styles.ident__svg} alt='Sketchplanations' />
        </picture>

      </Link>
      <Navigation />
    </div>
  );
}

export default Header
