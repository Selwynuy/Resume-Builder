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
 * @param prompt The prompt string to send
 * @param options Optional: { systemPrompt, temperature, maxTokens }
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
      console.error('Gemini API error:', err)
      throw new Error('Gemini API error: ' + err)
    }
    const data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> } = await res.json()
    // Gemini returns candidates[0].content.parts[0].text
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  } catch (error: unknown) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to get AI completion')
  }
} 