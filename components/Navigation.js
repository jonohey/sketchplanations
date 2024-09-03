import classNames from 'classnames'
import { ExternalLink } from 'lucide-react'
import { useRouter } from 'next/router'
import { RoughNotation } from 'react-rough-notation'

import styles from './Navigation.module.css'

import { Link } from 'components'

const roughNotationProps = {
  iterations: 1,
  animationDuration: 200,
  animationDelay: 50,
  padding: 3,
  type: 'underline',
}

const Navigation = () => {
  const router = useRouter()

  const isSelected = (path) => router.pathname === path

  return (
    <nav className={styles.root}>
      <Link href='/' className={classNames(styles.item, styles['item--home'])}>
        <RoughNotation show={isSelected('/')} {...roughNotationProps}>
          Home
        </RoughNotation>
      </Link>
      <Link href='/big-ideas-little-pictures' className={styles.item}>
        <RoughNotation show={isSelected('/big-ideas-little-pictures')} {...roughNotationProps}>
          Book!
        </RoughNotation>
      </Link>
      <a href='https://podcast.sketchplanations.com' target='_blank' rel='noreferrer' className={styles.item}>
        Podcast
        {/* <ExternalLinkIcon /> */}
        <span className={styles['external-link-icon']}>
          <ExternalLink size={16} />
        </span>
      </a>
      <Link href='/subscribe' className={styles.item}>
        <RoughNotation show={isSelected('/subscribe')} {...roughNotationProps}>
          Subscribe
        </RoughNotation>
      </Link>
      <Link href='/about' className={styles.item}>
        <RoughNotation show={isSelected('/about')} {...roughNotationProps}>
          About
        </RoughNotation>
      </Link>
      <a
        href='https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling'
        target='_blank'
        rel='noreferrer'
        className={styles.item}
      >
        Shop
        {/* <ExternalLinkIcon /> */}
        <span className={styles['external-link-icon']}>
          <ExternalLink size={16} />
        </span>
      </a>
    </nav>
  )
}

export default Navigation
