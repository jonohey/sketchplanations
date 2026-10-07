import Image from 'next/image'
import { useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ROTATION = 52
const DEPTH = 90
const VISIBLE = 3

// Pages stand at an angle either side of the middle one, a bit like a cover-flow
// viewer. The aim is to show there are lots of text/visual spreads, not to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const [active, setActive] = useState(Math.floor(images.length / 2))
  const dragStartX = useRef(null)

  const go = (delta) => setActive((i) => Math.min(images.length - 1, Math.max(0, i + delta)))

  return (
    <div
      className={styles.root}
      role='group'
      aria-roledescription='carousel'
      aria-label='Sample pages from the book'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1)
        if (e.key === 'ArrowRight') go(1)
      }}
      onPointerDown={(e) => {
        dragStartX.current = e.clientX
      }}
      onPointerUp={(e) => {
        if (dragStartX.current === null) return
        const dx = e.clientX - dragStartX.current
        dragStartX.current = null
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      }}
    >
      <div className={styles.stage}>
        {images.map((image, index) => {
          const d = index - active
          const abs = Math.abs(d)
          const rotate = d === 0 ? 0 : d > 0 ? -ROTATION : ROTATION
          return (
            <button
              key={image.filename}
              type='button'
              className={styles.page}
              style={{
                transform: `translateX(calc(-50% + ${d} * var(--step))) translateZ(${-abs * DEPTH}px) rotateY(${rotate}deg)`,
                zIndex: 100 - abs,
                opacity: abs > VISIBLE ? 0 : 1,
                pointerEvents: abs > VISIBLE ? 'none' : 'auto',
                filter: d === 0 ? 'none' : 'brightness(0.9)',
                cursor: d === 0 ? 'zoom-in' : 'pointer',
              }}
              tabIndex={-1}
              aria-hidden={abs > VISIBLE}
              aria-label={d === 0 ? `View ${image.conceptName} in gallery` : `Show ${image.conceptName}`}
              onClick={() => {
                if (d === 0) onOpen(index)
                else setActive(index)
              }}
            >
              <Image src={image.src} alt={image.alt} sizes='(max-width: 768px) 80vw, 480px' quality={75} className={styles.image} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BookPageFlow
