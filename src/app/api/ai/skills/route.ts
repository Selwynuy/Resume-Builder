import { NextResponse } from 'next/server';

import { getGeminiCompletion } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('AI skills POST body:', body);
    const { resumeContent, experienceDescriptions, jobDescription, jobTitle, industry } = body;
    let context = '';
    let prompt = '';
    
    // Priority 1: Full resume content (most comprehensive)
    if (resumeContent) {
      context = `Resume: ${resumeContent}`;
      prompt = `Based on the following resume, list 10 relevant hard and soft skills for the user. Return as a comma-separated list.\n${context}`;
    } 
    // Priority 2: Experience descriptions (good for role-specific skills)
    else if (experienceDescriptions) {
      context = `Experience: ${experienceDescriptions}`;
      prompt = `Based on the following experience, list 10 relevant hard and soft skills for the user. Return as a comma-separated list.\n${context}`;
    } 
    // Priority 3: Job description (for targeting specific role)
    else if (jobDescription) {
      context = `Job Description: ${jobDescription}`;
      prompt = `Based on the following job description, list 10 relevant hard and soft skills for a resume. Return as a comma-separated list.\n${context}`;
    } 
    // Priority 4: Job title/industry (fallback)
    else if (jobTitle || industry) {
      prompt = `List 10 relevant hard and soft skills for a resume for a ${jobTitle || ''} in ${industry || 'this field'}. Return as a comma-separated list.`;
    } 
    else {
      return NextResponse.json({ error: 'Missing context for skill suggestion' }, { status: 400 });
    }
    const skillsStr = await getGeminiCompletion(prompt);
    const skills = skillsStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    return NextResponse.json({ skills });
  } catch (e: unknown) {
    console.error('AI skills error:', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
