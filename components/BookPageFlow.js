import { Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ANGLE = -24 // negative: right (visual) side comes forward, left (text) side recedes
const PERSPECTIVE = 1100
const FLIP_EVERY_MS = 1500
const REST_AT_END_MS = 4000

// Whole spreads overlap like a leaning stack. Each page covers the text side of the
// next, so what you mostly see is the pictures. While it's on screen it flips through
// at a steady pace; clicking any page opens the gallery. The aim is to show there are
// lots of text/visual spreads, not for them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [vw, setVw] = useState(1200)
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    const update = () => setVw(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 })
    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [])

  // Flip on at a fixed pace, rest on the last page, then go round again
  const lastIndex = images.length - 1
  useEffect(() => {
    if (!inView || paused || reduceMotion) return
    const delay = active === lastIndex ? REST_AT_END_MS : FLIP_EVERY_MS
    const timer = setTimeout(() => setActive(active === lastIndex ? 0 : active + 1), delay)
    return () => clearTimeout(timer)
  }, [inView, paused, reduceMotion, active, lastIndex])

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

  // Pages from the open one onwards move along to make room, except when the first
  // page is open: nothing is in front of it, so it shows whole without moving
  const offsetOf = (i) => i * step + (i > active || (i === active && active > 0) ? open : 0)
  // Keep the open page near the middle, without revealing empty space at either end
  const shownWidth = active === 0 ? width : step + open
  const visibleCentre = offsetOf(active) + width - shownWidth / 2
  // When the first page is open it sits at the left with nothing before it. The lean
  // pulls its left edge inwards, so start a little off-screen to compensate.
  const leftInset = -Math.round(width * 0.1)
  const start = Math.min(leftInset, Math.max(vw - total, vw / 2 - visibleCentre))

  const go = (delta) => {
    setPaused(true)
    setActive((i) => Math.min(n - 1, Math.max(0, i + delta)))
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ height: height + 96 }}
      role='group'
      aria-roledescription='carousel'
      aria-label='Sample pages from the book'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
    >
      {images.map((image, index) => {
        const isActive = index === active
        return (
          <button
            key={image.filename}
            type='button'
            className={`${styles.page} ${isActive ? styles.pageActive : ''}`}
            style={{
              width,
              height,
              zIndex: n - index,
              transform: `translateX(${start + offsetOf(index)}px) perspective(${PERSPECTIVE}px) rotateY(${ANGLE}deg)`,
            }}
            tabIndex={-1}
            aria-label={`View ${image.conceptName} in gallery`}
            onClick={() => onOpen(index)}
          >
            <Image src={image.src} alt={image.alt} width={width} height={height} sizes={`${width}px`} quality={70} className={styles.image} />
          </button>
        )
      })}
      <div
        className={styles.end}
        style={{ width: endWidth, height, transform: `translateX(${start + pagesWidth + endGap}px)` }}
      >
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
      {!reduceMotion && (
        <button
          type='button'
          className={styles.playPause}
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Resume flipping through the pages' : 'Pause flipping through the pages'}
        >
          {paused ? <Play size={16} aria-hidden='true' /> : <Pause size={16} aria-hidden='true' />}
        </button>
      )}
    </div>
  )
}

export default BookPageFlow
