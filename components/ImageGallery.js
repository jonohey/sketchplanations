import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import styles from "./ImageGallery.module.css";

const MotionModal = motion.create(Modal);

const ImageGallery = ({ 
  images = [], 
  initialIndex = 0, 
  onClose, 
  isOpen = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrevious, goToNext]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const currentImage = useMemo(() => 
    images[currentIndex], [images, currentIndex]
  );

  if (!isOpen || images.length === 0) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={onClose}
    >
      <motion.div
        className="fixed inset-0 z-10 bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      
      <MotionModal
        className="fixed inset-0 z-20 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Dialog className="relative w-full h-full max-w-7xl max-h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={styles.navButton}
                style={{ left: '1rem' }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={goToNext}
                className={styles.navButton}
                style={{ right: '1rem' }}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className={styles.imageCounter}>
              {currentIndex + 1} of {images.length}
            </div>
          )}

          {/* Main image container */}
          <div className={styles.imageContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className={styles.imageWrapper}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  quality={90}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className={styles.thumbnailStrip}>
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                  }}
                  className={`${styles.thumbnail} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </Dialog>
      </MotionModal>
    </ModalOverlay>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    filename: PropTypes.string,
    conceptName: PropTypes.string
  })).isRequired,
  initialIndex: PropTypes.number,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool
};

export default ImageGallery;
