import { NextResponse } from 'next/server'
import { getGeminiCompletion } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { text, mode } = await req.json()
    if (!text || !mode) return NextResponse.json({ error: 'Missing text or mode' }, { status: 400 })
    let prompt = ''
    if (mode === 'generate') {
      prompt = `Write a strong, concise resume bullet point for this experience: ${text}`
    } else if (mode === 'rewrite') {
      prompt = `Rewrite this resume bullet point to be more impactful and professional: ${text}`
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }
    const suggestion = await getGeminiCompletion(prompt)
    return NextResponse.json({ suggestion })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 })
  }
} 