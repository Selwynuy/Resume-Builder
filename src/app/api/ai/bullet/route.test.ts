import { POST } from './route'
import * as gemini from '@/lib/gemini'

jest.mock('@/lib/gemini')
const mockGemini = gemini.getGeminiCompletion as jest.Mock

describe('/api/ai/bullet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns suggestion for generate', async () => {
    mockGemini.mockResolvedValue('Generated bullet')
    const req = { json: async () => ({ text: 'Did X', mode: 'generate' }) } as any
    const res = await POST(req)
    const data = await res.json()
    expect(data.suggestion).toBe('Generated bullet')
  })

  it('returns suggestion for rewrite', async () => {
    mockGemini.mockResolvedValue('Rewritten bullet')
    const req = { json: async () => ({ text: 'Did X', mode: 'rewrite' }) } as any
    const res = await POST(req)
    const data = await res.json()
    expect(data.suggestion).toBe('Rewritten bullet')
  })

  it('returns error for missing text', async () => {
    const req = { json: async () => ({ mode: 'generate' }) } as any
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns error for invalid mode', async () => {
    const req = { json: async () => ({ text: 'Did X', mode: 'foo' }) } as any
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'))
    const req = { json: async () => ({ text: 'Did X', mode: 'generate' }) } as any
    const res = await POST(req)
    const data = await res.json()
    expect(res.status).toBe(500)
    expect(data.error).toMatch(/fail/)
  })
}) 