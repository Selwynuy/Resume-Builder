/**
 * AI-powered bullet point generation and optimization API.
 * 
 * This endpoint provides intelligent resume bullet point assistance using Google Gemini AI.
 * It supports three modes: generate (create new), rewrite (improve existing), and multi (multiple styles).
 * 
 * @module bullet-route
 */

import { NextResponse } from 'next/server';

import { getGeminiCompletion } from '@/lib/gemini';

/**
 * POST /api/ai/bullet
 * 
 * Generates or optimizes resume bullet points using AI.
 * 
 * This endpoint accepts a text description and mode, then uses Google Gemini AI
 * to generate professional, impactful bullet points for resumes. It supports
 * multiple generation modes and can apply custom style prompts.
 * 
 * @param req - The incoming HTTP request
 * @param req.body - The request body containing bullet point data
 * @param req.body.text - The experience description or bullet point to work with
 * @param req.body.mode - The generation mode: 'generate', 'rewrite', or 'multi'
 * @param req.body.stylePrompt - Optional custom instructions for the AI
 * 
 * @returns JSON response with generated content or error message
 * 
 * @example
 * ```typescript
 * // Generate a new bullet point
 * const response = await fetch('/api/ai/bullet', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: 'Developed a React application',
 *     mode: 'generate'
 *   })
 * });
 * 
 * // Rewrite an existing bullet point
 * const response = await fetch('/api/ai/bullet', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: 'Did stuff with React',
 *     mode: 'rewrite',
 *     stylePrompt: 'Focus on quantifiable achievements'
 *   })
 * });
 * 
 * // Generate multiple style variations
 * const response = await fetch('/api/ai/bullet', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     text: 'Led a team of developers',
 *     mode: 'multi'
 *   })
 * });
 * // Returns: { summaries: { resultsOriented: "...", teamPlayer: "...", ... } }
 * ```
 * 
 * @throws {400} When text or mode is missing
 * @throws {400} When mode is invalid
 * @throws {500} When AI service encounters an error
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message || 'AI error' }, { status: 500 });
    }
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}
