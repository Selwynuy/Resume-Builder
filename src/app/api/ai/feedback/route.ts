import { NextResponse } from 'next/server';

import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('AI feedback POST body:', body);
    const { sectionText } = body;
    if (!sectionText) return NextResponse.json({ error: 'Missing sectionText' }, { status: 400 });
    // Update the prompt for user-friendly feedback
    const FEEDBACK_PROMPT = `
You are a resume coach. Give feedback grouped by section (Personal Info, Experience, Education, Skills). Use simple, short bullet points. Use plain language. Mark strengths with ✅, issues with ⚠️, and suggestions with 💡. Limit to 3 points per section. No markdown, no bold, no long explanations. Make it easy for anyone to understand.`;
    const prompt = `${FEEDBACK_PROMPT}\n\nResume Data:\n${sectionText}`;
    const feedback = await getGeminiCompletion(prompt);
    return NextResponse.json({ feedback });
  } catch (e: unknown) {
    console.error('AI feedback error:', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
