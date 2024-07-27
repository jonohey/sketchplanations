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

// const ExternalLinkIcon = () => (
//   <svg xmlns='http://www.w3.org/2000/svg' width='10' height='12' viewBox='0 0 13 15'>
//     <path
//       fill='currentColor'
//       fillRule='nonzero'
//       d='M11.56.316c.026 0 .052.002.077.003.584.026.987.261.9.825-.011.078-.098.24-.227.446l-.173.265-.199.292-.428.599-.64.853C9.756 5.183 8.813 6.95 8.02 9.168a.5.5 0 1 1-.941-.336c.823-2.308 1.808-4.153 2.972-5.808.134-.19.267-.374.407-.561l.275-.362-.335.153c-.34.159-.67.317-.99.474l-.624.315c-.508.262-.987.524-1.438.784l-.526.311c-.256.156-.502.311-.738.466l-.459.31-.432.308C1.076 8.246.795 11.107 3.223 13.645a.5.5 0 1 1-.722.691C-.846 10.838.22 6.78 7.114 2.827l.588-.329c.2-.11.406-.219.615-.328l.642-.328c.263-.131.533-.262.81-.393l-1.684.166-1.171.104-.664.054-1.357.1c-.921.062-1.877.117-2.89.164a.5.5 0 1 1-.046-1C2.962.992 3.91.938 4.825.876L6.17.776 6.83.723 7.992.619l2.521-.246.442-.036.236-.014.198-.007h.17Z'
//     />
//   </svg>
// )

const Navigation = () => {
  const router = useRouter()

  const isSelected = (path) => router.pathname === path

  return (
    <nav className={styles.root}>
      {/* <Link href='/explore' className={styles.item}>
        <RoughNotation show={isSelected('/explore')} {...roughNotationProps}>
          Explore
        </RoughNotation>
      </Link> */}
      <Link href='/big-ideas-little-pictures' className={styles.item}>
        <RoughNotation show={isSelected('/big-ideas-little-pictures')} {...roughNotationProps}>
          Book!
        </RoughNotation>
      </Link>
      <a href='https://podcast.sketchplanations.com' target='_blank' rel='noreferrer' className={styles.item}>
        Podcast
        {/* <ExternalLinkIcon /> */}
        <ExternalLink strokeWidth={1} size={16} />
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
        <ExternalLink strokeWidth={1} size={16} />
      </a>
    </nav>
  )
}

export default Navigation
