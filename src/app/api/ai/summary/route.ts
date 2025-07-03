import { NextResponse } from 'next/server'
import { getGeminiCompletion } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('AI summary POST body:', body)
    const { text, mode } = body
    if (!mode) return NextResponse.json({ error: 'Missing mode' }, { status: 400 })
    let prompt = ''
    if (mode === 'generate') {
      prompt = 'Write a professional resume summary for a job seeker.'
    } else if (mode === 'improve') {
      if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })
      prompt = `Improve this resume summary for clarity, impact, and professionalism: ${text}`
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
    }
    const suggestion = await getGeminiCompletion(prompt)
    return NextResponse.json({ suggestion })
  } catch (e: any) {
    console.error('AI summary error:', e)
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 })
  }
} 