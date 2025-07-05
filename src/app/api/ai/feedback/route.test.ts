import * as gemini from '@/lib/gemini';

import { POST } from './route';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns feedback for valid input', async () => {
    mockGemini.mockResolvedValue('Feedback');
    const req = { json: async () => ({ sectionText: 'Section' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(data.feedback).toBe('Feedback');
  });

  it('returns error for missing input', async () => {
    const req = { json: async () => ({}) } as any;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ sectionText: 'Section' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });
});
