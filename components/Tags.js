import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'throttle-debounce'

import { isBlank } from 'helpers'

import styles from './Tags.module.css'

const Tags = ({ tags }) => {
  const containerRef = useRef(null)
  const [isScrollableLeft, setIsScrollableLeft] = useState(false)
  const [isScrollableRight, setIsScrollableRight] = useState(false)

  useEffect(() => {
    const container = containerRef.current

    const onLayoutChange = debounce(100, () => {
      const container = containerRef.current
      const { scrollLeft, scrollWidth, clientWidth } = container

      setIsScrollableLeft(scrollLeft > 0)
      setIsScrollableRight(scrollWidth - scrollLeft > clientWidth)
    })

    container.addEventListener('scroll', onLayoutChange)
    window.addEventListener('resize', onLayoutChange)

    return () => {
      container.removeEventListener('scroll', onLayoutChange)
      window.removeEventListener('resize', onLayoutChange)
    }
  }, [])

  if (isBlank(tags)) return null

  return (
    <div className={styles.root}>
      <div className={styles.tags} ref={containerRef}>
        <span className={styles.label}>Explore by tag:</span>
        {tags.map(({ data: { identifier: tag }, slugs }) => (
          <Link key={tag} href={`/tags/${slugs[0]}`}>
            {tag}
          </Link>
        ))}
      </div>
      <div
        className={classNames(
          styles['overflow-indicator'],
          styles['overflow-indicator--left'],
          isScrollableLeft && styles['overflow-indicator--active']
        )}
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fillRule='evenodd' clipRule='evenodd'>
          <path d='M4 .755 18.374 12 4 23.219l.619.781L20 12 4.609 0 4 .755z' />
        </svg>
      </div>
      <div
        className={classNames(
          styles['overflow-indicator'],
          styles['overflow-indicator--right'],
          isScrollableRight && styles['overflow-indicator--active']
        )}
      >
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fillRule='evenodd' clipRule='evenodd'>
          <path d='M4 .755 18.374 12 4 23.219l.619.781L20 12 4.609 0 4 .755z' />
        </svg>
      </div>
    </div>
  )
}

export default Tags
