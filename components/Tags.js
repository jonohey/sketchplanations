import classNames from 'classnames'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { debounce } from 'throttle-debounce'

import styles from './Tags.module.css'

const OverflowIndicator = ({ direction, isScrollable, onClick }) => {
  const className = classNames(
    styles['overflow-indicator'],
    styles[`overflow-indicator--${direction}`],
    isScrollable && styles['overflow-indicator--active']
  )

  return (
    <div className={className}>
      <button className={styles['overflow-indicator__button']} onClick={onClick}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fillRule='evenodd' clipRule='evenodd'>
          <path d='M4 .755 18.374 12 4 23.219l.619.781L20 12 4.609 0 4 .755z' />
        </svg>
      </button>
    </div>
  )
}

const Tags = ({ tags, align = 'center' }) => {
  const containerRef = useRef(null)
  const [isScrollableLeft, setIsScrollableLeft] = useState(false)
  const [isScrollableRight, setIsScrollableRight] = useState(false)

  const onLayoutChange = debounce(100, () => {
    const container = containerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container

    setIsScrollableLeft(scrollLeft > 0)
    setIsScrollableRight(scrollWidth - scrollLeft > clientWidth)
  })

  useEffect(onLayoutChange, [tags])

  useEffect(() => {
    const container = containerRef.current

    container?.addEventListener('scroll', onLayoutChange)
    window?.addEventListener('resize', onLayoutChange)

    return () => {
      container?.removeEventListener('scroll', onLayoutChange)
      window?.removeEventListener('resize', onLayoutChange)
    }
  }, [])

  return (
    <div className={styles.root}>
      <div className={classNames(styles.tags, align === 'left' && styles['tags--align-left'])} ref={containerRef}>
        {tags?.map(({ data: { identifier: tag }, slugs }) => (
          <Link key={tag} href={`/categories/${slugs[0]}`} className={styles.tag}>
            {tag}
          </Link>
        ))}
        <Link href='/categories' className={styles['more-tags']}>
          Explore categories
        </Link>
      </div>
      <OverflowIndicator
        direction='left'
        isScrollable={isScrollableLeft}
        onClick={() => (containerRef.current.scrollLeft -= 100)}
      />
      <OverflowIndicator
        direction='right'
        isScrollable={isScrollableRight}
        onClick={() => (containerRef.current.scrollLeft += 100)}
      />
    </div>
  )
}

export default Tags
