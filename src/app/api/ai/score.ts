import { NextResponse } from 'next/server'
import { getGeminiCompletion } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json()
    if (!resume) return NextResponse.json({ error: 'Missing resume' }, { status: 400 })

    // Simple keyword match (if jobDescription provided)
    let keywordMatch = null
    if (jobDescription) {
      const jobWords = jobDescription.toLowerCase().split(/\W+/)
      const resumeWords = resume.toLowerCase().split(/\W+/)
      const matchCount = jobWords.filter((w: string) => resumeWords.includes(w)).length
      keywordMatch = Math.round((matchCount / jobWords.length) * 100)
    }

    // Readability: Flesch-Kincaid (very basic)
    const sentences = resume.split(/[.!?]/).length
    const words = resume.split(/\s+/).length
    const syllables = resume.split(/[aeiouy]+/i).length
    const readability = Math.max(0, Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)))

    // Gemini: holistic scoring and suggestions
    const prompt = `Score this resume for overall quality, ATS compatibility, and provide actionable suggestions. Return JSON: { overallScore: 0-100, atsScore: 0-100, suggestions: [string] }\nResume:\n${resume}${jobDescription ? `\nJob Description:\n${jobDescription}` : ''}`
    const geminiResp = await getGeminiCompletion(prompt)
    let aiScore = {}
    try {
      aiScore = JSON.parse(geminiResp)
    } catch {
      aiScore = { overallScore: null, atsScore: null, suggestions: [geminiResp] }
    }

    return NextResponse.json({
      ...aiScore,
      keywordMatch,
      readability: Math.round(readability)
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 })
  }
} 