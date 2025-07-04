import { NextResponse } from 'next/server';
import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { resume, jobDescription } = await req.json();
    if (!resume || !jobDescription)
      return NextResponse.json({ error: 'Missing resume or jobDescription' }, { status: 400 });
    const prompt = `Based on this resume and job description, generate 5 likely interview questions and suggested answers.\nResume:\n${resume}\nJob Description:\n${jobDescription}`;
    const result = await getGeminiCompletion(prompt);
    return NextResponse.json({ result });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
