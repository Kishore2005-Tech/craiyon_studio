'use client'

import { useState, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import PromptInput from '@/components/PromptInput'
import ImageDisplay from '@/components/ImageDisplay'
import HistoryGrid from '@/components/HistoryGrid'

interface HistoryItem {
  id: string
  imageUrl: string
  prompt: string
}

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square')

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      setImageUrl(data.imageUrl)

      // Add to history (max 6 items)
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        imageUrl: data.imageUrl,
        prompt: prompt.trim(),
      }

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 5)])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [prompt])

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Craiyon AI
          </h1>
          <Sparkles className="w-8 h-8 text-pink-500" />
        </div>
        <p className="text-slate-400 text-lg">Transform your imagination into stunning AI-generated images</p>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Aspect Ratio Selector */}
        <div className="flex gap-3 justify-center flex-wrap">
          {(['square', 'portrait', 'landscape'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                aspectRatio === ratio
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {ratio.charAt(0).toUpperCase() + ratio.slice(1)}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 sm:p-8">
          <PromptInput
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            onExampleClick={handleExampleClick}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-2xl p-4 text-red-200">
            <p className="font-semibold">Error: {error}</p>
            <p className="text-sm text-red-300 mt-1">Please try again or with a different prompt.</p>
          </div>
        )}

        {/* Image Display */}
        {(imageUrl || isLoading) && (
          <ImageDisplay
            imageUrl={imageUrl}
            prompt={prompt}
            isLoading={isLoading}
            onRegenerate={handleRegenerate}
            aspectRatio={aspectRatio}
          />
        )}

        {/* History Grid */}
        {history.length > 0 && (
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 sm:p-8">
            <HistoryGrid items={history} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-slate-500 text-sm">
        <p>Powered by Craiyon AI • Images generated using Pollinations.ai</p>
        <p className="mt-2">© 2024 Craiyon AI. All rights reserved.</p>
      </footer>
    </main>
  )
}
