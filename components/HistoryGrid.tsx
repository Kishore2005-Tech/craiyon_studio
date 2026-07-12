'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Download, Copy, Check } from 'lucide-react'

interface HistoryItem {
  id: string
  imageUrl: string
  prompt: string
}

interface HistoryGridProps {
  items: HistoryItem[]
}

export default function HistoryGrid({ items }: HistoryGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `craiyon-ai-${index}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-bold text-slate-50">Recent Generations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 auto-rows-max">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative group aspect-square rounded-lg overflow-hidden bg-slate-900 border border-slate-700 hover:border-purple-500 transition-colors"
          >
            <Image
              src={item.imageUrl}
              alt={item.prompt}
              fill
              className="object-cover"
              unoptimized
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <button
                onClick={() => handleDownload(item.imageUrl, index)}
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
                title="Download image"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => handleCopyPrompt(item.id, item.prompt)}
                className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
                title="Copy prompt"
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>

            {/* Prompt Tooltip */}
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <p className="text-xs text-slate-200 line-clamp-3 break-words">
                {item.prompt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
