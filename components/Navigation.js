import classNames from 'classnames'
import { useRouter } from 'next/router'
import { RoughNotation } from 'react-rough-notation'

import { Link } from 'components'

import styles from './Navigation.module.css'

const roughNotiationProps = {
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
      <Link href='/about' className={styles.item}>
        <RoughNotation show={isSelected('/about')} {...roughNotiationProps}>
          About
        </RoughNotation>
      </Link>
      <Link href='/explore' className={styles.item}>
        <RoughNotation show={isSelected('/explore')} {...roughNotiationProps}>
          Explore
        </RoughNotation>
      </Link>
      <Link href='/subscribe' className={classNames(styles.item, styles['gt-sm-screen'])}>
        <RoughNotation show={isSelected('/subscribe')} {...roughNotiationProps}>
          Subscribe
        </RoughNotation>
      </Link>
      <a
        href='https://www.redbubble.com/people/sketchplanator/shop?asc=u'
        target='_blank'
        rel='noreferrer'
        className={classNames(styles.item, styles['gt-xxs-screen'])}
      >
        Prints
      </a>
    </nav>
  )
}

export default Navigation
