import { getGeminiCompletion } from './gemini'

jest.mock('node-fetch', () => jest.fn())
const fetch = require('node-fetch')

describe('getGeminiCompletion', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    process.env = { ...OLD_ENV, GEMINI_API_KEY: 'test-key' }
    jest.resetModules()
  })
  afterAll(() => {
    process.env = OLD_ENV
  })

  it('returns a string from Gemini', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'Hello world' }] } }] })
    })
    const result = await getGeminiCompletion('Say hello')
    expect(result).toBe('Hello world')
  })

  it('throws if GEMINI_API_KEY is missing', async () => {
    process.env.GEMINI_API_KEY = ''
    jest.resetModules()
    // Remove fetch mock for this test
    jest.unmock('node-fetch')
    const { getGeminiCompletion: freshGemini } = require('./gemini')
    await expect(freshGemini('test')).rejects.toThrow('GEMINI_API_KEY not set')
  })

  it('throws on Gemini API error', async () => {
    fetch.mockResolvedValue({ ok: false, text: async () => 'API error' })
    await expect(getGeminiCompletion('fail')).rejects.toThrow('Gemini API error')
  })
}) 