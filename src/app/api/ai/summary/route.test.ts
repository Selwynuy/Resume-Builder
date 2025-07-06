import * as gemini from '@/lib/gemini';

import { POST } from './route';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/summary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns suggestion for generate', async () => {
    mockGemini.mockResolvedValue(JSON.stringify({ professional: 'Generated summary', creative: '', friendly: '', technical: '' }));
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('Generated summary');
  });

  it('returns suggestion for improve', async () => {
    mockGemini.mockResolvedValue(JSON.stringify({ professional: 'Improved summary', creative: '', friendly: '', technical: '' }));
    const req = { json: async () => ({ text: 'Old summary', mode: 'improve' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('Improved summary');
  });

  it('returns error for missing mode', async () => {
    const req = { json: async () => ({}) } as Partial<Request> as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns error for missing text in improve', async () => {
    const req = { json: async () => ({ mode: 'improve' }) } as Partial<Request> as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns error for invalid mode', async () => {
    const req = { json: async () => ({ mode: 'foo' }) } as Partial<Request> as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });
});
