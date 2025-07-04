import { NextResponse } from 'next/server';
import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('AI bullet POST body:', body);
    const { text, mode, stylePrompt } = body;
    if (!text || !mode)
      return NextResponse.json({ error: 'Missing text or mode' }, { status: 400 });
    let prompt = '';
    if (mode === 'generate') {
      prompt = `Write a strong, concise resume bullet point for this experience: ${text}`;
    } else if (mode === 'rewrite') {
      prompt = `Rewrite this resume bullet point to be more impactful and professional: ${text}`;
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }
    if (stylePrompt) prompt += '\n' + stylePrompt;
    const suggestion = await getGeminiCompletion(prompt);
    return NextResponse.json({ suggestion });
  } catch (e: unknown) {
    console.error('AI bullet error:', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
