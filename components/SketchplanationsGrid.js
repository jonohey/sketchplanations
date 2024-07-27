import Link from 'next/link'

import styles from './SketchplanationsGrid.module.css'

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

  return (
    <div className={styles.grid}>
      {images.map((image) => (
        <Link key={image.uid} href={`/${image.uid}`}>
          <div className={styles.gridItem}>
            <div className={styles.title}>{image.title}</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} loading='lazy' alt={image.alt} style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SketchplanationsGrid
