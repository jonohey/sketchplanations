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
    <div ref={sceneRef} className={styles.scene} aria-hidden='true' data-testid='footer-scene'>
      <div className={styles.atmosphere} />
      <div className={styles.clouds} />
      <div className={styles.boatPosition}>
        <img
          className={styles.boat}
          src='/images/footer/boat.png'
          alt=''
          width='995'
          height='966'
          fetchPriority='low'
        />
      </div>
      <div className={styles.waves} />
    </div>
  )
}

export default FooterScene
