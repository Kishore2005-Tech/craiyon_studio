'use client'

import { useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from './ui/button'

const EXAMPLE_PROMPTS = [
  'a cat astronaut floating in space',
  'cyberpunk city at night with neon lights',
  'serene mountain landscape at sunset',
  'underwater alien civilization',
  'steampunk robot with intricate details',
  'enchanted forest with magical creatures',
]

interface PromptInputProps {
  prompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: () => void
  isLoading: boolean
  onExampleClick: (example: string) => void
}

export default function PromptInput({
  prompt,
  onPromptChange,
  onGenerate,
  isLoading,
  onExampleClick,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Only submit on Enter if not composing (for CJK IME support)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      if (prompt.trim()) {
        onGenerate()
      }
    }
  }

  const characterCount = prompt.length
  const maxCharacters = 500

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create... (Shift+Enter for new line)"
          maxLength={maxCharacters}
          disabled={isLoading}
          className="w-full min-h-32 rounded-2xl bg-slate-900 px-6 py-4 text-slate-50 placeholder-slate-400 border border-slate-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="absolute bottom-3 right-3 text-xs text-slate-500">
          {characterCount}/{maxCharacters}
        </span>
      </div>

      {/* Example Prompts */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example}
            onClick={() => onExampleClick(example)}
            disabled={isLoading}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 hover:border-slate-600"
          >
            {example}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!prompt.trim() || isLoading}
        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {isLoading ? 'Generating...' : 'Generate Image'}
      </Button>
    </div>
  )
}
