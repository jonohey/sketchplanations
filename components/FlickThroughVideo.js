import { track } from '@vercel/analytics'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const REPLAY_DELAY_MS = 3000

// Silent promo that plays when scrolled into view, rests on its last frame, then replays.
const FlickThroughVideo = ({ src, poster, title }) => {
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  const inView = useRef(false)
  const userPaused = useRef(false)
  const [state, setState] = useState('idle') // idle | playing | paused | ended

  const play = () => {
    clearTimeout(timerRef.current)
    videoRef.current?.play().catch(() => setState('paused'))
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (entry.isIntersecting) {
          if (!reduceMotion && !userPaused.current && !video.ended) play()
        } else {
          clearTimeout(timerRef.current)
          video.pause()
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(video)
    return () => {
      observer.disconnect()
      clearTimeout(timerRef.current)
    }
  }, [])

  const toggle = () => {
    const video = videoRef.current
    track('Book-video-toggle')
    if (video.ended) {
      userPaused.current = false
      video.currentTime = 0
      play()
    } else if (video.paused) {
      userPaused.current = false
      play()
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  const Icon = state === 'ended' ? RotateCcw : state === 'playing' ? Pause : Play
  const label = state === 'ended' ? 'Replay video' : state === 'playing' ? 'Pause video' : 'Play video'

  return (
    <div>
      <div className='relative rounded-lg overflow-hidden bg-black' style={{ aspectRatio: '16 / 9' }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload='metadata'
          aria-label={title}
          className='block w-full h-full m-0 object-cover'
          onPlay={() => setState('playing')}
          onPause={() => {
            if (!videoRef.current.ended) setState('paused')
          }}
          onEnded={() => {
            setState('ended')
            // Rest on the final frame for a moment, then go round again while it's on screen
            timerRef.current = setTimeout(() => {
              if (inView.current && !userPaused.current) {
                videoRef.current.currentTime = 0
                play()
              }
            }, REPLAY_DELAY_MS)
          }}
        />
        <button
          type='button'
          onClick={toggle}
          aria-label={label}
          className='absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75 transition-colors'
        >
          <Icon size={20} aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}

export default FlickThroughVideo
