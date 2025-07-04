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
    } else if (mode === 'multi') {
      // Multi-style job description suggestions
      const styles = [
        { key: 'resultsOriented', label: 'Results-Oriented', prompt: `Write a single, concise, ready-to-use job description sentence that emphasizes measurable results and achievements for this experience: ${text}\nReturn only the sentence. No bullet points, no lists, no explanations, no preamble, no advice.` },
        { key: 'teamPlayer', label: 'Team Player', prompt: `Write a single, concise, ready-to-use job description sentence that highlights teamwork, collaboration, and interpersonal skills for this experience: ${text}\nReturn only the sentence. No bullet points, no lists, no explanations, no preamble, no advice.` },
        { key: 'innovative', label: 'Innovative', prompt: `Write a single, concise, ready-to-use job description sentence that showcases creativity, problem-solving, or innovation for this experience: ${text}\nReturn only the sentence. No bullet points, no lists, no explanations, no preamble, no advice.` },
        { key: 'concise', label: 'Concise', prompt: `Write a single, concise, ready-to-use job description sentence that is short, direct, and to the point for this experience: ${text}\nReturn only the sentence. No bullet points, no lists, no explanations, no preamble, no advice.` },
      ];
      const summaries: Record<string, string> = {};
      for (const style of styles) {
        let stylePromptText = style.prompt;
        if (stylePrompt) stylePromptText += '\n' + stylePrompt;
        // eslint-disable-next-line no-await-in-loop
        let result = await getGeminiCompletion(stylePromptText);
        // Post-process: extract only the first sentence (up to first period)
        if (result) {
          // Remove bullet points, asterisks, and trim
          result = result.replace(/^[-*•\s]+/, '').trim();
          // Take only the first sentence if multiple
          const firstSentence = result.split(/(?<=[.!?])\s/)[0];
          summaries[style.key] = firstSentence;
        } else {
          summaries[style.key] = '';
        }
      }
      return NextResponse.json({ summaries });
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
