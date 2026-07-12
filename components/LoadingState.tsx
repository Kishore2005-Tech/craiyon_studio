'use client'

import { useEffect, useState } from 'react'

const STATUS_MESSAGES = [
  'Mixing pixels...',
  'Teaching the AI to paint...',
  'Almost there...',
  'Creating something magical...',
  'Processing your imagination...',
  'Rendering dreams into reality...',
]

export default function LoadingState() {
  const [message, setMessage] = useState(STATUS_MESSAGES[0])

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % STATUS_MESSAGES.length
      setMessage(STATUS_MESSAGES[index])
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* Rotating Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin" />
      </div>

      {/* Status Message */}
      <p className="text-slate-300 text-lg font-medium min-h-6 text-center transition-all duration-300">
        {message}
      </p>
    </div>
  )
}
