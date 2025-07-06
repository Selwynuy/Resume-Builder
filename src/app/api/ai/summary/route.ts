import { NextResponse } from 'next/server';

import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, mode, stylePrompt } = body;
    if (!mode) return NextResponse.json({ error: 'Missing mode' }, { status: 400 });
    let prompt = '';
    if (mode === 'generate' || mode === 'improve') {
      const base = mode === 'generate'
        ? 'Write a professional resume summary for a job seeker.'
        : `Improve this resume summary for clarity, impact, and professionalism: ${text}`;
      prompt = `${base}\nGenerate 4 different versions of the summary in these styles: Professional, Creative, Friendly, Technical. Return only the summaries, each clearly labeled, in JSON:\n{\n  "professional": "...",\n  "creative": "...",\n  "friendly": "...",\n  "technical": "..."\n}\nNo explanations, no extra text.`;
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
    if (stylePrompt) prompt += '\n' + stylePrompt;
    const raw = await getGeminiCompletion(prompt);
    let summaries = null;
    try {
      summaries = JSON.parse(raw);
    } catch (err1) {
      console.error('Failed to parse Gemini JSON:', raw, err1);
      // Fallback: strip Markdown code fences and HTML tags, then try again
      const cleaned = raw
        .replace(/```json|```/gi, '') // remove code fences
        .replace(/<[^>]+>/g, '')      // remove HTML tags
        .trim();
      try {
        summaries = JSON.parse(cleaned);
      } catch (err2) {
        console.error('Fallback parse also failed:', cleaned, err2);
        return NextResponse.json({ error: 'AI did not return valid JSON', raw, cleaned, err1: String(err1), err2: String(err2) }, { status: 500 });
      }
    }
    return NextResponse.json({ summaries });
  } catch (e: unknown) {
    console.error('AI summary error:', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
