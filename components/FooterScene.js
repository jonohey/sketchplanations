import Link from 'next/link'
import { useEffect, useRef } from 'react'

import styles from './FooterScene.module.css'

const FooterScene = () => {
  const sceneRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!scene || reducedMotion) {
      return
    }

    let animationFrame = 0
    let isNearViewport = false

    const updateProgress = () => {
      animationFrame = 0

      if (!isNearViewport) {
        return
      }

      const bounds = scene.getBoundingClientRect()
      const travel = window.innerHeight + bounds.height
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / travel))

      scene.style.setProperty('--footer-progress', progress.toFixed(3))
    }

    const requestProgressUpdate = () => {
      if (isNearViewport && !animationFrame) {
        animationFrame = window.requestAnimationFrame(updateProgress)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting
        scene.dataset.active = isNearViewport ? 'true' : 'false'

        if (isNearViewport) {
          requestProgressUpdate()
        }
      },
      { rootMargin: '25% 0px' }
    )

    observer.observe(scene)
    window.addEventListener('scroll', requestProgressUpdate, { passive: true })
    window.addEventListener('resize', requestProgressUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', requestProgressUpdate)
      window.removeEventListener('resize', requestProgressUpdate)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div ref={sceneRef} className={styles.scene} data-testid='footer-scene'>
      <div className={styles.atmosphere} aria-hidden='true' />
      <div className={styles.clouds} aria-hidden='true' />
      <Link
        href='/big-ideas-little-pictures'
        className={styles.bookLink}
        aria-label='View the Big Ideas Little Pictures book'
      >
        <span className={styles.boatPosition}>
          <picture>
            <source srcSet='/images/footer/boat.webp' type='image/webp' />
            <img
              className={styles.boat}
              src='/images/footer/boat.png'
              alt=''
              width='995'
              height='966'
              fetchPriority='low'
            />
          </picture>
        </span>
        <span className={styles.waves} />
      </Link>
    </div>
  )
}

export default FooterScene
