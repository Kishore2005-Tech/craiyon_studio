import { NextRequest, NextResponse } from 'next/server'
export async function POST(request: NextRequest) {
  try {
   const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // Encode the prompt for the API URL
    const encodedPrompt = encodeURIComponent(prompt)
    
    // Use Pollinations.ai free image API
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`

    // Verify the image is accessible by making a HEAD request
    try {
      const headResponse = await fetch(imageUrl, { method: 'HEAD' })
      if (!headResponse.ok) {
        throw new Error('Failed to generate image')
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to generate image. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
