'use client'


import Image from 'next/image'
import { Download, RotateCw, Copy, Check } from 'lucide-react'
import { Button } from './ui/button'
import LoadingState from './LoadingState'

interface ImageDisplayProps {
  imageUrl: string | null
  prompt: string
  isLoading: boolean
  onRegenerate: () => void
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

export default function ImageDisplay({
  imageUrl,
  prompt,
  isLoading,
  onRegenerate,
  aspectRatio,
}: ImageDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `craiyon-ai-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download image:', error)
      alert('Failed to download image. Please try again.')
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'portrait':
        return 'aspect-[3/4]'
      case 'landscape':
        return 'aspect-[4/3]'
      default:
        return 'aspect-square'
    }
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl bg-slate-900 border border-slate-700 p-8">
        <LoadingState />
      </div>
    )
  }

  if (!imageUrl) {
    return null
  }

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className={`relative w-full ${getAspectRatioClass()} rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl`}>
        <Image
          src={imageUrl}
          alt={prompt}
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-10 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
        <Button
          onClick={onRegenerate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl h-10 flex items-center justify-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          Regenerate
        </Button>
        <Button
          onClick={handleCopyPrompt}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl h-10 flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </Button>
      </div>

      {/* Prompt Display */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Prompt</p>
        <p className="text-slate-200 text-sm break-words">{prompt}</p>
      </div>
    </div>
  )
}
