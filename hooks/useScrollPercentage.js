import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const calculateVerticalPercentage = (bounds, threshold = 0, root = window) => {
  if (!root) return 0

  const vh = (root instanceof Element ? root.clientHeight : root.innerHeight) || 0
  const offset = threshold * bounds.height
  const percentage = (bounds.bottom - offset) / (vh + bounds.height - offset * 2)

  return 1 - Math.max(0, Math.min(1, percentage))
}

const calculateHorizontalPercentage = (bounds, threshold = 0, root = window) => {
  if (!root) return 0

  const vw = (root instanceof Element ? root.clientWidth : root.innerWidth) || 0
  const offset = threshold * bounds.width
  const percentage = (bounds.right - offset) / (vw + bounds.width - offset * 2)

  return 1 - Math.max(0, Math.min(1, percentage))
}

const useScrollPercentage = (options = {}) => {
  const [ref, inView, entry] = useInView(options)
  const [percentage, setPercentage] = useState(0)
  const target = entry && entry.target

  useEffect(() => {
    const handleScroll = () => {
      if (!target) return
      const bounds = target.getBoundingClientRect()
      const percentage = options.horizontal
        ? calculateHorizontalPercentage(bounds, options.threshold, options.root)
        : calculateVerticalPercentage(bounds, options.threshold, options.root)

      setPercentage(percentage)
    }

    if (inView) {
      const root = options.root || window
      root.addEventListener('scroll', handleScroll, { passive: true })
      root.addEventListener('resize', handleScroll)

      return () => {
        root.removeEventListener('scroll', handleScroll)
        root.removeEventListener('resize', handleScroll)
      }
    }

    // Trigger a scroll update, so we set the initial scroll percentage
    handleScroll()
    return
  }, [inView, options.root, options.horizontal, options.threshold, target])

  return [ref, percentage, entry]
}

export default useScrollPercentage
