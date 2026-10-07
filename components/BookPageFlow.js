import Image from 'next/image'
import { useState } from 'react'
import styles from './BookPageFlow.module.css'

// A row of spreads all leaning the same way: the visual (right-hand) side is nearer
// and larger, the text side recedes. Pointing at one gives it more room. The aim is
// to show there are lots of text/visual spreads, not for them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const [active, setActive] = useState(Math.floor(images.length / 2))

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
    >
      <div
        className={styles.stage}
        style={{ gridTemplateColumns: images.map((_, i) => (i === active ? 'var(--open)' : '1fr')).join(' ') }}
      >
        {images.map((image, index) => {
          const isActive = index === active
          return (
            <button
              key={image.filename}
              type='button'
              className={`${styles.page} ${isActive ? styles.pageActive : ''}`}
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
              <Image src={image.src} alt={image.alt} sizes='(max-width: 768px) 60vw, 600px' quality={75} className={styles.image} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BookPageFlow
