import { NextResponse } from 'next/server'
import { getGeminiCompletion } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { sectionText } = await req.json()
    if (!sectionText) return NextResponse.json({ error: 'Missing sectionText' }, { status: 400 })
    const prompt = `Give actionable feedback to improve this resume section:\n${sectionText}`
    const feedback = await getGeminiCompletion(prompt)
    return NextResponse.json({ feedback })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 })
  }
} 