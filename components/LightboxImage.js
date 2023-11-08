import PropTypes from 'prop-types'
import React, { useState } from 'react'

import styles from './LightboxImage.module.css'

function LightboxImage({ src, alt, caption }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <img src={src} alt={alt} onClick={handleClick} onKeyDown={handleKeyDown} role='button' tabIndex='0' />
      {isOpen && (
        <div
          role='dialog'
          aria-modal='true'
          aria-labelledby='lightbox-caption'
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex='0'
          className={styles.lightboxContainer}
        >
          <img src={src} alt={alt} className={styles.lightboxImage} />
          {caption && (
            <p id='lightbox-caption' className={styles.lightboxCaption}>
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}

LightboxImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  caption: PropTypes.string,
}

export default LightboxImage
