'use client'

import { flip } from '@floating-ui/react'
import { offset } from '@floating-ui/react'
import { shift } from '@floating-ui/react'
import { useHover } from '@floating-ui/react'
import { useTransitionStyles } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { useFocus } from '@floating-ui/react'
import { inline } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import sketchTooltipsData from '../sketch-tooltips-data.json'

const SketchTooltip = ({ uid, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const image = sketchTooltipsData.find(({ uid: dataUid }) => dataUid === uid)

  if (!uid || !image) return null

  const { refs, context, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [
      offset({
        mainAxis: 18,
        crossAxis: 24,
      }),
      flip(),
      shift(10),
      inline(),
    ],
  })

  const hover = useHover(context, {
    delay: {
      open: 100,
      close: 0,
    },
  })
  const focus = useFocus(context)

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 200,
    initial: {
      opacity: 0,
    },
    open: {
      opacity: 1,
    },
    close: {
      opacity: 0,
    },
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus])

  // const randomRotate = useMemo(() => Math.random() * 10 - 5, [isMounted]);
  // const getRandomRotate = useCallback(() => Math.random() * 10 - 5, []);

  const [rotate, setRotate] = useState(0)

  useEffect(() => {
    if (isMounted) {
      setRotate(Math.random() * 10 - 5)
    }
  }, [isMounted])

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </span>
      {isMounted && image && (
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...styles }}
          {...getFloatingProps()}
          className='pointer-events-none'
        >
          <AnimatePresence>
            {isMounted && (
              <motion.div
                className='w-[10rem] rounded shadow-md overflow-hidden'
                initial={{
                  scale: 0.9,
                  rotate: 0,
                  y: 20,
                }}
                animate={{
                  scale: 1,
                  rotate,
                  y: 0,
                }}
                exit={{
                  scale: 0.9,
                  rotate: 0,
                  y: 20,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 5,
                  mass: 0.1,
                }}
              >
                {image ? (
                  <Image
                    // className="m-0 object-cover object-top"
                    className='m-0'
                    src={image.url}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                    sizes='10rem'
                    width={image.dimensions.width}
                    height={image.dimensions.height}
                  />
                ) : (
                  <div className='mx-auto p-4'>
                    <LoaderCircle className='animate-spin' strokeWidth={1} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

export default SketchTooltip
