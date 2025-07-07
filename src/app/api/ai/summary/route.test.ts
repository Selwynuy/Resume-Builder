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

  it('handles stylePrompt for generate mode', async () => {
    mockGemini.mockResolvedValue(JSON.stringify({ professional: 'Generated summary', creative: '', friendly: '', technical: '' }));
    const req = { json: async () => ({ mode: 'generate', stylePrompt: 'Make it more technical' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('Generated summary');
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Make it more technical'));
  });

  it('handles stylePrompt for improve mode', async () => {
    mockGemini.mockResolvedValue(JSON.stringify({ professional: 'Improved summary', creative: '', friendly: '', technical: '' }));
    const req = { json: async () => ({ text: 'Old summary', mode: 'improve', stylePrompt: 'Make it more creative' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('Improved summary');
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Make it more creative'));
  });

  it('handles JSON parsing fallback when initial parse fails', async () => {
    // Mock Gemini to return invalid JSON wrapped in markdown
    mockGemini.mockResolvedValue('```json\n{"professional": "Fallback summary"}\n```');
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('Fallback summary');
  });

  it('handles JSON parsing fallback with HTML tags', async () => {
    // Mock Gemini to return JSON with HTML tags
    mockGemini.mockResolvedValue('<div>{"professional": "HTML cleaned summary"}</div>');
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.summaries.professional).toBe('HTML cleaned summary');
  });

  it('returns error when both JSON parsing attempts fail', async () => {
    // Mock Gemini to return completely invalid JSON
    mockGemini.mockResolvedValue('This is not JSON at all');
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe('AI did not return valid JSON');
    expect(data.raw).toBe('This is not JSON at all');
    expect(data.cleaned).toBe('This is not JSON at all');
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

  it('handles non-Error exceptions', async () => {
    mockGemini.mockRejectedValue('String error');
    const req = { json: async () => ({ mode: 'generate' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe('AI error');
  });
});
