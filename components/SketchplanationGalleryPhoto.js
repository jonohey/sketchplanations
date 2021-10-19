import Imgix from 'react-imgix'
import Link from 'next/link'

const SketchplanationGalleryPhoto = ({ photo }) => {
  return (
    <Link href={`/${photo.uid}`} key={photo.uid}>
      <a>
        <Imgix
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
        />
      </a>
    </Link>
  )
}

export default SketchplanationGalleryPhoto