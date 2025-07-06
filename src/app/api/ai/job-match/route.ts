import { NextResponse } from 'next/server';

import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resume, jobDescription } = body;
    if (!resume || !jobDescription)
      return NextResponse.json({ error: 'Missing resume or jobDescription' }, { status: 400 });
    const prompt = `Analyze this resume and job description. List missing keywords and skills from the job description that are not present in the resume. Then suggest edits to improve the match.\nResume:\n${resume}\nJob Description:\n${jobDescription}`;
    const result = await getGeminiCompletion(prompt);
    return NextResponse.json({ result });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
