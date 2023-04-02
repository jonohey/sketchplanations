import Image from 'next/image'
import Link from 'next/link'

const SketchplanationGalleryPhoto = ({ photo }) => {
  return (
    <Link href={`/${photo.uid}`} key={photo.uid}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes='(min-width: 848px) 800px, (min-width: 640px) calc(100vw - 3rem), 100w'
      />
    </Link>
  )
}

export default SketchplanationGalleryPhoto
