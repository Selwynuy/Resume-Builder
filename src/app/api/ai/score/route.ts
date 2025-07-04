import { NextResponse } from 'next/server';
import { getGeminiCompletion } from '@/lib/gemini';

// Fallback: strip HTML tags if present
function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '');
}

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();
    if (!resume) return NextResponse.json({ error: 'Missing resume' }, { status: 400 });

    // Simple keyword match (if jobDescription provided)
    let keywordMatch = null;
    if (jobDescription) {
      const jobWords = jobDescription.toLowerCase().split(/\W+/);
      const resumeWords = resume.toLowerCase().split(/\W+/);
      const matchCount = jobWords.filter((w: string) => resumeWords.includes(w)).length;
      keywordMatch = Math.round((matchCount / jobWords.length) * 100);
    }

    // Readability: Flesch-Kincaid (very basic)
    const sentences = resume.split(/[.!?]/).length;
    const words = resume.split(/\s+/).length;
    const syllables = resume.split(/[aeiouy]+/i).length;
    const readability = Math.max(
      0,
      Math.min(100, 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words))
    );

    // Gemini: holistic scoring and suggestions
    const prompt = `Score this resume for overall quality, ATS compatibility, and provide actionable suggestions. Return ONLY valid JSON: { overallScore: 0-100, atsScore: 0-100, suggestions: [string] } with no extra text, no markdown, no explanation, no HTML.\nResume:\n${resume}${jobDescription ? `\nJob Description:\n${jobDescription}` : ''}`;
    const geminiResp = await getGeminiCompletion(prompt);
    let aiScore = {};
    // If Gemini returns HTML or non-JSON, strip tags and try parsing again
    try {
      aiScore = JSON.parse(geminiResp);
    } catch {
      // Sometimes Gemini returns HTML or extra text, so we strip tags and try again
      try {
        aiScore = JSON.parse(stripHtml(geminiResp));
      } catch {
        aiScore = { overallScore: null, atsScore: null, suggestions: [stripHtml(geminiResp)] };
      }
    }

    // Industry benchmarking
    const benchmarkPrompt = `Compare this resume to industry standards for similar roles. Is it above, below, or at average? Give a 1-2 sentence summary.\nResume:\n${resume}${jobDescription ? `\nJob Description:\n${jobDescription}` : ''}`;
    const benchmark = await getGeminiCompletion(benchmarkPrompt);

    return NextResponse.json({
      ...aiScore,
      keywordMatch,
      readability: Math.round(readability),
      benchmark,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
  }
}
