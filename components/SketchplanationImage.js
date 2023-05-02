import Image from 'next/image'

const SketchplanationImage = ({ image, title, priority = false }) => {
  const { width, height } = image.dimensions
  const paddingTopPercentage = (height / width) * 100

  return (
    <div className='relative' style={{ width: '100%', paddingTop: `${paddingTopPercentage}%` }}>
      <Image
        src={image.url}
        alt={image.alt || `${title} - Sketchplanations`}
        sizes='(min-width: 648px) 600px, (min-width: 640px) calc(100vw - 3rem), 100w'
        priority={priority}
        fill='responsive'
      />
    </div>
  )
}

export default SketchplanationImage
