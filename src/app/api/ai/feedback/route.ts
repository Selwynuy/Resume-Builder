import { NextResponse } from 'next/server';
import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('AI feedback POST body:', body);
    const { sectionText } = body;
    if (!sectionText) return NextResponse.json({ error: 'Missing sectionText' }, { status: 400 });
    const prompt = `Give actionable feedback to improve this resume section:\n${sectionText}`;
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
