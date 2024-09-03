import classNames from 'classnames'
import Image from 'next/image'
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
    <div className={styles.root}>
      {images.map((image) => (
        <Link
          key={image.uid}
          href={{
            pathname: '/[uid]',
            query: { uid: image.uid },
          }}
        >
          <div className={classNames(styles.item, 'group')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className={styles['item__title']}>{image.title}</div>
            <Image
              className={styles['item__img']}
              src={image.src}
              width={image.width}
              height={image.height}
              loading='lazy'
              alt={image.alt}
              sizes='(max-width: 14rem) 100vw, (max-width: 28rem) 50vw, (max-width: 42rem) 33.33vw, (max-width: 56rem) 25vw, 14rem'
            />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default SketchplanationsGrid
