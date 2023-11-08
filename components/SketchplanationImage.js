import Image from 'next/image'
import { useState } from 'react'
import styles from './SketchplanationImage.module.css'
import classNames from 'classnames'

const SketchplanationImage = ({ image, title, priority = false, lightbox = true, onDownload = () => {} }) => {
  const { width, height } = image.dimensions
  const paddingTopPercentage = (height / width) * 100

  const [isOpen, setIsOpen] = useState(false)

  const handleKeyDown = (event) => {
    if (!lightbox) return

    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleClick = () => {
    if (!lightbox) return

    setIsOpen(!isOpen)
  }

  return (
    <>
      <div
        className={classNames(styles.root, lightbox && styles.root__lightbox)}
        style={{ width: '100%', paddingTop: `${paddingTopPercentage}%` }}
      >
        <Image
          src={image.url}
          alt={image.alt || `${title} - Sketchplanations`}
          sizes='(min-width: 648px) 600px, (min-width: 640px) calc(100vw - 3rem), 100w'
          priority={priority}
          fill='responsive'
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role='button'
          tabIndex='0'
        />
      </div>
      {isOpen && (
        <div
          role='dialog'
          aria-modal='true'
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex='0'
          className={styles.lightbox}
        >
          <div>
            <button className={styles.button} type='button' onClick={handleClick}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12'>
                <path d='M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z' />
              </svg>
              Close
            </button>
          </div>
          <div className={styles.lightbox__image}>
            <Image
              className={styles.lightbox__img}
              src={image.url}
              alt={image.alt || `${title} - Sketchplanations`}
              sizes='100w'
              fill
            />
          </div>
          <div>
            <button className={styles.button} type='button' onClick={onDownload}>
              <svg width='14' height='19' xmlns='http://www.w3.org/2000/svg'>
                <path d='M11.951 7.095L7.757 11.29V0H6.243v11.29L2.05 7.095.979 8.166 7 14.187l6.022-6.021-1.07-1.07zM0 16.964h14v1.513H0v-1.513z' />
              </svg>
              Download highest-quality image
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SketchplanationImage
