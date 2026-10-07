import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ANGLE = -24 // negative: right (visual) side comes forward, left (text) side recedes
const PERSPECTIVE = 1100

// Scroll progress runs from the top of the stack being near the bottom of the screen
// to it being near the top, as fractions of the viewport height.
const SCROLL_START = 0.95
const SCROLL_END = 0.2

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// Whole spreads overlap like a leaning stack. Each page covers the text side of the
// next, so what you mostly see is the pictures. The stack is locked to the page scroll:
// scrolling past flips through the pages, scrolling back flips back. Clicking any page
// opens the gallery. The aim is to show there are lots of text/visual spreads, not for
// them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const rootRef = useRef(null)
  const [vw, setVw] = useState(1200)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = rootRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = null

    const measure = () => {
      frame = null
      setVw(el.clientWidth)
      // People who prefer reduced motion get a still stack rather than one that moves as they scroll
      if (reduceMotion) return setProgress(0.5)
      const top = el.getBoundingClientRect().top
      const startY = window.innerHeight * SCROLL_START
      const endY = window.innerHeight * SCROLL_END
      setProgress(clamp((startY - top) / (startY - endY), 0, 1))
    }
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  const n = images.length
  const height = vw < 640 ? 150 : vw < 1024 ? 220 : 290
  const width = Math.round(height * 2)
  const open = width * 0.5
  // Make the stack much wider than the screen so it runs off both sides
  const step = Math.max(14, (vw * 1.7 - width - open) / (n - 1))
  const pagesWidth = (n - 1) * step + open + width
  // Unframed closing note after the last page
  const endWidth = vw < 640 ? 190 : 300
  const endGap = 32
  const total = pagesWidth + endGap + endWidth

  // Which page is "open" as a fractional index. Pages from there on are held apart by
  // `open` so the current page shows beyond the one covering it; the first page needs no
  // room because nothing is in front of it.
  const current = progress * (n - 1)
  const shiftOf = (i) => (i === 0 ? 0 : open * clamp(i - current + 1, 0, 1))

  // The first page starts flush left (the lean pulls its edge inwards, so start a little
  // off-screen to compensate) and the closing note ends flush right.
  const startLeft = -Math.round(width * 0.1)
  const start = startLeft + (Math.min(startLeft, vw - total) - startLeft) * progress

  return (
    <div ref={rootRef} className={styles.root} style={{ height: height + 96 }} role='group' aria-label='Sample pages from the book'>
      {images.map((image, index) => (
        <button
          key={image.filename}
          type='button'
          className={styles.page}
          style={{
            width,
            height,
            zIndex: n - index,
            transform: `translateX(${start + index * step + shiftOf(index)}px) perspective(${PERSPECTIVE}px) rotateY(${ANGLE}deg)`,
          }}
          // One tab stop is enough; the gallery has its own arrow-key navigation
          tabIndex={index === 0 ? 0 : -1}
          aria-label={`View ${image.conceptName} in gallery`}
          onClick={() => onOpen(index)}
        >
          <Image src={image.src} alt={image.alt} width={width} height={height} sizes={`${width}px`} quality={70} className={styles.image} />
        </button>
      ))}
      <div className={styles.end} style={{ width: endWidth, height, transform: `translateX(${start + pagesWidth + endGap}px)` }}>
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
  )
}

export default BookPageFlow
