import { NextResponse } from 'next/server'
import { getGeminiCompletion } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('AI skills POST body:', body)
    const { jobTitle, industry } = body
    if (!jobTitle && !industry) return NextResponse.json({ error: 'Missing jobTitle or industry' }, { status: 400 })
    const prompt = `List 10 relevant hard and soft skills for a resume for a ${jobTitle || ''} in ${industry || 'this field'}. Return as a comma-separated list.`
    const skillsStr = await getGeminiCompletion(prompt)
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean)
    return NextResponse.json({ skills })
  } catch (e: any) {
    console.error('AI skills error:', e)
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 })
  }
} 