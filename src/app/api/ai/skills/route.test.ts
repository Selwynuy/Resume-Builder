import { POST } from './route';
import * as gemini from '@/lib/gemini';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/skills', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns skills array', async () => {
    mockGemini.mockResolvedValue('Skill1, Skill2, Skill3');
    const req = { json: async () => ({ jobTitle: 'Dev', industry: 'Tech' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(data.skills).toEqual(['Skill1', 'Skill2', 'Skill3']);
  });

  it('returns error for missing input', async () => {
    const req = { json: async () => ({}) } as any;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ jobTitle: 'Dev' }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });
});
