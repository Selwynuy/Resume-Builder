import * as gemini from '@/lib/gemini';

import { POST } from './route';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/cover-letter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cover letter for valid input', async () => {
    mockGemini.mockResolvedValue('Cover letter');
    const req = { json: async () => ({ resume: 'My resume', jobDescription: 'Job desc' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.coverLetter).toBe('Cover letter');
  });

  it('returns error for missing input', async () => {
    const req = { json: async () => ({}) } as Partial<Request> as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ resume: 'My resume', jobDescription: 'Job desc' }) } as Partial<Request> as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });
});
