import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ANGLE = -24 // negative: right (visual) side comes forward, left (text) side recedes
const PERSPECTIVE = 1100

// Whole spreads overlap like a leaning stack. Each page covers the text side of the
// next, so what you mostly see is the pictures. Pointing at one opens up space around it.
// The aim is to show there are lots of text/visual spreads, not for them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)
  const [vw, setVw] = useState(1200)

  useEffect(() => {
    const el = rootRef.current
    const update = () => setVw(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
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

  // Pages from the open one onwards move along to make room, except when the first
  // page is open: nothing is in front of it, so it shows whole without moving
  const offsetOf = (i) => i * step + (i > active || (i === active && active > 0) ? open : 0)
  // Keep the open page near the middle, without revealing empty space at either end
  const shownWidth = active === 0 ? width : step + open
  const visibleCentre = offsetOf(active) + width - shownWidth / 2
  // When the first page is open it sits at the left with nothing before it. The lean
  // pulls its left edge inwards, so start a little off-screen to compensate.
  // On wide screens leave a gutter for the "Sample pages" label instead.
  const showLabel = vw >= 1024
  const leftInset = showLabel ? 90 : -Math.round(width * 0.1)
  const start = Math.min(leftInset, Math.max(vw - total, vw / 2 - visibleCentre))

  const go = (delta) => setActive((i) => Math.min(n - 1, Math.max(0, i + delta)))

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
      {showLabel && (
        <p className={`${styles.label} ${active === 0 ? '' : styles.labelHidden}`} style={{ top: 48 + height / 2 - 24 }} aria-hidden='true'>
          Sample pages
        </p>
      )}
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
            aria-label={isActive ? `View ${image.conceptName} in gallery` : `Show ${image.conceptName}`}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setActive(index)
            }}
            onClick={() => {
              if (isActive) onOpen(index)
              else setActive(index)
            }}
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
    </div>
  )
}

export default BookPageFlow
