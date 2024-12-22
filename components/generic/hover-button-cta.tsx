'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { AnimatedTooltip } from './animated-tooltip'

interface HoverInfoButtonProps {
  buttonText: string
  infoText: string
  ctaText: string
  link: string
}

export const HoverInfoButton: React.FC<HoverInfoButtonProps> = ({
  buttonText,
  infoText,
  ctaText,
  link,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link href={link} passHref>
        <Button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group flex w-[300px] items-center justify-between bg-[#b6f36e] p-8 pr-12 text-lg font-bold text-black shadow-lg hover:bg-[#a5e45d]"
        >
          <div className=" -ml-4 mr-2 flex-shrink-0">
            <AnimatedTooltip
              items={[
                {
                  id: 1,
                  name: 'Johannes',
                  designation: 'Hallo, ich bin Johannes.',
                  image: '/landing/team/hans.png',
                },
              ]}
            />
          </div>
          <span className="ml-4">{buttonText}</span>
        </Button>
      </Link>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 z-10 mb-2"
          >
            <Card className="w-64 border-2 border-[#b6f36e] bg-white/95 shadow-xl backdrop-blur-sm">
              <CardContent className="p-4">
                <p className="mb-3 text-sm font-extrabold  text-gray-800">
                  {infoText}
                </p>
                <div className="flex items-center text-primary">
                  <Calendar className="mr-2 h-4 w-4 text-[#b6f36e]" />
                  <span className="text-sm font-medium text-black">
                    {ctaText}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
