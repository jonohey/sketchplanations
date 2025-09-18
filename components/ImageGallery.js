import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ImageGallery.module.css";

const ImageGallery = ({ 
  images = [], 
  initialIndex = 0, 
  onClose, 
  isOpen = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  // Handle touch events for pinch-to-zoom
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      setIsDragging(true);
    }
  }, [getTouchDistance]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      // Pinch to zoom
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance) {
        const scaleChange = currentDistance / lastTouchDistance;
        setScale(prev => Math.min(Math.max(prev * scaleChange, 0.5), 3));
      }
      setLastTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      // Pan when zoomed
      const touch = e.touches[0];
      setPosition(prev => ({
        x: prev.x + (touch.movementX || 0),
        y: prev.y + (touch.movementY || 0)
      }));
    }
  }, [getTouchDistance, lastTouchDistance, isDragging, scale]);

  const handleTouchEnd = useCallback(() => {
    setLastTouchDistance(null);
    setIsDragging(false);
  }, []);

  // Handle double tap to zoom
  const handleDoubleClick = useCallback(() => {
    if (scale === 1) {
      setScale(2);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

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
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 backdrop-blur-md flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={onClose}
        >
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
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className={styles.navButton}
                style={{ left: '1rem' }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
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
          <div 
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="relative"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.7 }}
                transition={{ 
                  duration: 0.15, 
                  ease: "easeInOut"
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleDoubleClick}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200}
                  height={900}
                  className="object-contain max-w-full max-h-full"
                  sizes="100vw"
                  priority
                  quality={90}
                  style={{
                    touchAction: 'manipulation',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </AnimatePresence>
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
