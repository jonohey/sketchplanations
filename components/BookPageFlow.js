import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './BookPageFlow.module.css'

const ANGLE = -30 // negative: right (visual) side comes forward, left (text) side recedes
const PERSPECTIVE = 1000
// The gallery holds every spread; the stack just needs enough to look like plenty
const MAX_STACKED = 9

// Whole spreads overlap like a leaning stack, the first one open and the rest fanned out
// behind it. Each page covers the text side of the next, so what you mostly see is the
// pictures. Clicking any page opens the gallery. The aim is to show there are lots of
// text/visual spreads, not for them to be read.
const BookPageFlow = ({ images, onOpen }) => {
  const rootRef = useRef(null)
  const [vw, setVw] = useState(1200)

  useEffect(() => {
    const el = rootRef.current
    const update = () => setVw(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const stacked = images.slice(0, MAX_STACKED)
  const n = stacked.length
  const height = vw < 640 ? 150 : vw < 1024 ? 220 : 290
  const width = Math.round(height * 2)
  // How far the first page stands clear of the second so it shows whole
  const open = width * 0.35
  // The first page sits partly off the left of the screen (its text side is the least
  // interesting bit), which leaves more room to show each of the pages that follow
  const startLeft = -Math.round(width * 0.5)
  // Run the fan out to roughly the right-hand edge of the screen
  const step = Math.max(14, (vw * 1.05 - startLeft - width - open) / (n - 1))

  return (
    <div ref={rootRef} className={styles.root} style={{ height: height + 96 }} role='group' aria-label='Sample pages from the book'>
      {stacked.map((image, index) => (
        <button
          key={image.filename}
          type='button'
          className={styles.page}
          style={{
            width,
            height,
            zIndex: n - index,
            transform: `translateX(${startLeft + index * step + (index === 0 ? 0 : open)}px) perspective(${PERSPECTIVE}px) rotateY(${ANGLE}deg)`,
          }}
          // One tab stop is enough; the gallery has its own arrow-key navigation
          tabIndex={index === 0 ? 0 : -1}
          aria-label={`View ${image.conceptName} in gallery`}
          onClick={() => onOpen(index)}
        >
          <Image src={image.src} alt={image.alt} width={width} height={height} sizes={`${width}px`} quality={70} className={styles.image} />
        </button>
      ))}
    </div>
  )
}

export default BookPageFlow
