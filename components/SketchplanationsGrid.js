import Image from 'next/image'
import Link from 'next/link'

import styles from './SketchplanationsGrid.module.css'

import { isBlank } from 'helpers'

const prismicDocsToImages = (prismicDocs) => {
  try {
    return prismicDocs.map(
      ({
        uid,
        data: {
          title,
          image: {
            url,
            alt,
            dimensions: { width, height },
          },
        },
      }) => ({
        src: url,
        width,
        height,
        alt: alt || `${title} - Sketchplanations`,
        uid,
        title,
      })
    )
  } catch {
    return []
  }
}

const SketchplanationsGrid = ({ prismicDocs }) => {
  const images = prismicDocsToImages(prismicDocs)

  if (isBlank(images)) return <div className={styles.noResults}>No sketches found</div>

  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <div key={image.uid} className={styles.gridItem}>
          <div className={styles.title}>{image.title}</div>
          <img src={image.src} alt={image.alt} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      ))}
    </div>
  )
}

export default SketchplanationsGrid
