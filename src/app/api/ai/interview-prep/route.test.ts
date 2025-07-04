import { POST } from './route';
import * as gemini from '@/lib/gemini';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/interview-prep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns result for valid input', async () => {
    mockGemini.mockResolvedValue('Questions and answers');
    const req = { json: async () => ({ resume: 'My resume', jobDescription: 'Job desc' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(data.result).toBe('Questions and answers');
  });

  it('returns error for missing input', async () => {
    const req = { json: async () => ({}) } as any;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ resume: 'My resume', jobDescription: 'Job desc' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });
});
