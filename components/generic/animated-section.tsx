'use client'
import { motion, useInView } from 'framer-motion'
import React from 'react'

const fadeVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeScale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  fadeRotate: {
    hidden: { opacity: 0, rotate: -10, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  fadeBlur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
}

const AnimatedSection = ({
  children,
  className = 'w-full py-12 md:py-14 lg:py-16', // default className
  variant = 'fadeUp',
  delay = 0,
  duration = 1,
  threshold = 0.3,
  once = true,
}) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, {
    once,
    margin: '0px 0px -200px 0px',
    amount: threshold,
  })

  const selectedVariant = fadeVariants[variant]

  return (
    <motion.div
      ref={ref}
      variants={selectedVariant}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
