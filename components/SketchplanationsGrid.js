import Image from 'next/image'
import Link from 'next/link'
import JustifiedGrid from 'react-justified-grid'

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
      })
    )
  } catch {
    return []
  }
}

const SketchplanationsGrid = ({ prismicDocs }) => {
  const images = prismicDocsToImages(prismicDocs)

  return (
    <JustifiedGrid images={images} maxRowHeight={550} gutter={20} showIncompleteRow>
      {(processedImages) => {
        return (
          <>
            {processedImages.map((image, index) => {
              const { src, width, height, left, top, originalData } = image
              return (
                <Link key={index} href={`/${originalData.uid}`} className='absolute bg-paper' style={{ left, top }}>
                  <Image
                    src={src}
                    width={width}
                    height={height}
                    alt={originalData.alt}
                    sizes='(min-width: 2750px) calc(20vw + 20 * 4), (min-width: 2200px) 25vw, (min-width: 1650px) 33vw, (min-width: 1100px) 50vw, 100vw'
                  />
                </Link>
              )
            })}
          </>
        )
      }}
    </JustifiedGrid>
  )
}

export default SketchplanationsGrid
