import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ANGLE = -30 // negative: right (visual) side comes forward, left (text side) recedes
const PERSPECTIVE = 1000
// How many pages the fan shows across the screen before the rest are reached by scrolling
const PAGES_ON_SCREEN = 9
// The widest a spread is ever drawn (see the sizes in the component)
const MAX_SPREAD_WIDTH = 580

// Whole spreads overlap like a leaning stack, the first one open and the rest fanned out
// behind it. Each page covers the text side of the next, so what you mostly see is the
// pictures. The row scrolls sideways for anyone who wants to see the rest, and clicking any
// page opens the gallery. The aim is to show there are lots of text/visual spreads, not for
// them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const rootRef = useRef(null)
  const [vw, setVw] = useState(1200)
  const [measured, setMeasured] = useState(false)
  const [near, setNear] = useState(false)
  const placed = useRef(false)

  const n = images.length
  // Small screens get pages big enough to make out, and so fewer of them across the screen
  const small = vw < 640
  const height = small ? 240 : 290
  const width = Math.round(height * 2)
  // A little extra room for the second page, so it shows only slightly more than the
  // pages after it; everything else shares the remaining width evenly
  const open = width * 0.1
  // The first page sits partly off the left of the screen (its text side is the least
  // interesting bit), which leaves more room to show each of the pages that follow
  const startLeft = -Math.round(width * 0.42)
  // Run the first PAGES_ON_SCREEN pages out to roughly the right-hand edge of the screen
  const step = Math.max(small ? 64 : 14, (vw * 1.05 - startLeft - width - open) / (PAGES_ON_SCREEN - 1))
  // Unframed closing note after the last page, reached by scrolling right
  const endWidth = small ? 190 : 300
  const endGap = 32
  const pagesEnd = (n - 1) * step + open + width
  const trackWidth = pagesEnd + endGap + endWidth + 24
  // Scrolling can't go to negative positions, so the track starts at the first page's
  // left edge and we scroll across by `startLeft` to put the text side just off-screen
  const xOf = (index) => index * step + (index === 0 ? 0 : open)

  useEffect(() => {
    const el = rootRef.current
    const update = () => {
      setVw(el.clientWidth)
      setMeasured(true)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // The browser's own lazy loading is unreliable for images far along a sideways-scrolling
  // row, so load every page once the row is close to the screen instead
  useEffect(() => {
    const el = rootRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Once the real width is known, start scrolled so the first page's text side is off-screen
  useEffect(() => {
    if (placed.current || !measured) return
    placed.current = true
    rootRef.current.scrollLeft = -startLeft
  }, [measured, startLeft])

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ '--spread-height': `${height}px`, height: `calc(${height}px + var(--headroom) + 48px)` }}
      role='group'
      aria-label='Sample pages from the book. Scroll sideways for more.'
      tabIndex={0}
    >
      <div className={styles.track} style={{ width: trackWidth }}>
        {images.map((image, index) => (
          // The slot holds the position and lean and never moves, so the hover area is stable
          // while the page inside it pops up
          <div
            key={image.filename}
            className={styles.slot}
            style={{
              width,
              height,
              zIndex: n - index,
              transform: `translateX(${xOf(index)}px) perspective(${PERSPECTIVE}px) rotateY(${ANGLE}deg)`,
            }}
          >
            <button
              type='button'
              className={styles.page}
              // The gallery has its own arrow-key navigation, so the pages needn't all be tab stops
              tabIndex={-1}
              aria-label={`View ${image.conceptName} in gallery`}
              onClick={() => onOpen(index)}
            >
              {/* The size attributes are fixed (CSS sizes the picture to its slot) so the image source
                  never changes when the real screen width is measured after the page loads; a source
                  that changes mid-load can leave later images blank on phones */}
              <Image
                src={image.src}
                alt={image.alt}
                width={MAX_SPREAD_WIDTH}
                height={MAX_SPREAD_WIDTH / 2}
                sizes='(max-width: 639px) 480px, 580px'
                placeholder='blur'
                loading={near ? 'eager' : 'lazy'}
                className={styles.image}
              />
            </button>
          </div>
        ))}
        <div className={styles.end} style={{ width: endWidth, height, transform: `translateX(${pagesEnd + endGap}px)` }}>
          <p className={styles.endTitle}>…and lots more inside.</p>
          <a
            href='#order'
            className={styles.endLink}
            onClick={(e) => {
              e.preventDefault()
              const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              document.getElementById('order')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
            }}
          >
            Get the book for the rest →
          </a>
        </div>
      </div>
    </div>
  )
}

export default BookPageFlow
