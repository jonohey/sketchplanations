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
  const [active, setActive] = useState(Math.floor(images.length / 2))
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
  const total = (n - 1) * step + open + width

  const offsetOf = (i) => i * step + (i >= active ? open : 0)
  // Keep the open page near the middle, without revealing empty space at either end
  const visibleCentre = offsetOf(active) + width - (step + open) / 2
  const start = Math.min(0, Math.max(vw - total, vw / 2 - visibleCentre))

  const go = (delta) => setActive((i) => Math.min(n - 1, Math.max(0, i + delta)))

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ height: height + 48 }}
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
    </div>
  )
}

export default BookPageFlow
