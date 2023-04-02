import Image from 'next/image'
import Link from 'next/link'

const SketchplanationGalleryPhoto = ({ photo }) => {
  return (
    <Link href={`/${photo.uid}`} key={photo.uid}>
      {/* <Imgix
        className='lazyload'
        src={photo.src}
        attributeConfig={{
          src: 'data-src',
          srcSet: 'data-srcset',
          sizes: 'data-sizes',
        }}
        htmlAttributes={{
          src: `${photo.src}&w=400&blur=200&px=16`,
          style: { margin: 16, display: 'block' },
          width: photo.width,
          height: photo.height,
        }}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
      /> */}
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
        // layout='responsive'
      />
    </Link>
  )
}

export default SketchplanationGalleryPhoto
