/**
 * Google Gemini API integration for AI-powered resume features.
 * Provides intelligent content generation, optimization, and suggestions.
 * 
 * @module gemini
 */

let fetchFn: typeof fetch;
if (typeof fetch === 'function') {
  fetchFn = fetch;
} else {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  fetchFn = require('node-fetch');
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Simple in-memory rate limiter
let lastCall = 0
const MIN_INTERVAL = 1500 // ms between calls

/**
 * Send a prompt to Google Gemini and return the completion.
 * 
 * This function provides AI-powered content generation for resume features including:
 * - Professional summary generation
 * - Bullet point optimization
 * - Skills suggestions
 * - Cover letter assistance
 * - Interview preparation
 * 
 * The function includes built-in rate limiting (1.5s between calls) to respect API limits
 * and prevent excessive usage.
 * 
 * @param prompt - The text prompt to send to Gemini AI
 * @param options - Optional configuration for the AI request
 * @param options.temperature - Controls randomness in the response (0.0 to 1.0). Lower values = more deterministic
 * @param options.maxTokens - Maximum number of tokens in the response (default: model limit)
 * 
 * @returns Promise<string> - The AI-generated text response
 * 
 * @throws {Error} When GEMINI_API_KEY is not set in environment variables
 * @throws {Error} When the Gemini API returns an error response
 * @throws {Error} When network or other errors occur during the request
 * 
 * @example
 * ```typescript
 * // Generate a professional summary
 * const summary = await getGeminiCompletion(
 *   'Write a professional summary for a software engineer with 5 years of experience',
 *   { temperature: 0.7 }
 * );
 * 
 * // Optimize a bullet point
 * const optimized = await getGeminiCompletion(
 *   'Rewrite this bullet point to be more impactful: "Did stuff with React"',
 *   { temperature: 0.3 }
 * );
 * ```
 * 
 * @since 1.0.0
 */
export async function getGeminiCompletion(prompt: string, options?: { temperature?: number; maxTokens?: number }): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in environment')
  const now = Date.now()
  if (now - lastCall < MIN_INTERVAL) {
    await new Promise(res => setTimeout(res, MIN_INTERVAL - (now - lastCall)))
  }
  lastCall = Date.now()

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    ...options
  }

  try {
    const res = await fetchFn(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error('Gemini API error: ' + err)
    }
    const data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } = await res.json()
    // Gemini returns candidates[0].content.parts[0].text
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (error: unknown) {
    throw new Error('Failed to get AI completion')
  }
} 