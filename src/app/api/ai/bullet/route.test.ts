import * as gemini from '@/lib/gemini';

import { POST } from './route';

jest.mock('@/lib/gemini');
const mockGemini = gemini.getGeminiCompletion as jest.Mock;

describe('/api/ai/bullet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns suggestion for generate', async () => {
    mockGemini.mockResolvedValue('Generated bullet');
    const req = { json: async () => ({ text: 'Did X', mode: 'generate' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.suggestion).toBe('Generated bullet');
  });

  it('returns suggestion for rewrite', async () => {
    mockGemini.mockResolvedValue('Rewritten bullet');
    const req = { json: async () => ({ text: 'Did X', mode: 'rewrite' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.suggestion).toBe('Rewritten bullet');
  });

  it('handles stylePrompt for generate mode', async () => {
    mockGemini.mockResolvedValue('Generated bullet with style');
    const req = { json: async () => ({ text: 'Did X', mode: 'generate', stylePrompt: 'Make it professional' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.suggestion).toBe('Generated bullet with style');
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Make it professional'));
  });

  it('handles stylePrompt for rewrite mode', async () => {
    mockGemini.mockResolvedValue('Rewritten bullet with style');
    const req = { json: async () => ({ text: 'Did X', mode: 'rewrite', stylePrompt: 'Make it concise' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(data.suggestion).toBe('Rewritten bullet with style');
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Make it concise'));
  });

  it('returns multi-style summaries for multi mode', async () => {
    mockGemini
      .mockResolvedValueOnce('Results: Increased sales by 50%')
      .mockResolvedValueOnce('Team: Collaborated with 10 team members')
      .mockResolvedValueOnce('Innovation: Developed new solution')
      .mockResolvedValueOnce('Concise: Led project successfully');
    
    const req = { json: async () => ({ text: 'Led a project', mode: 'multi' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.summaries).toEqual({
      resultsOriented: 'Results: Increased sales by 50%',
      teamPlayer: 'Team: Collaborated with 10 team members',
      innovative: 'Innovation: Developed new solution',
      concise: 'Concise: Led project successfully'
    });
  });

  it('handles stylePrompt in multi mode', async () => {
    mockGemini.mockResolvedValue('Summary with style');
    const req = { json: async () => ({ text: 'Led a project', mode: 'multi', stylePrompt: 'Use active voice' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Use active voice'));
    expect(data.summaries).toBeDefined();
  });

  it('handles empty results in multi mode', async () => {
    mockGemini.mockResolvedValue('');
    const req = { json: async () => ({ text: 'Led a project', mode: 'multi' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.summaries.resultsOriented).toBe('');
  });

  it('handles results with bullet points in multi mode', async () => {
    mockGemini.mockResolvedValue('• Increased sales by 50%');
    const req = { json: async () => ({ text: 'Led a project', mode: 'multi' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.summaries.resultsOriented).toBe('Increased sales by 50%');
  });

  it('handles multiple sentences in multi mode', async () => {
    mockGemini.mockResolvedValue('Increased sales by 50%. Also improved efficiency.');
    const req = { json: async () => ({ text: 'Led a project', mode: 'multi' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    
    expect(data.summaries.resultsOriented).toBe('Increased sales by 50%.');
  });

  it('returns error for missing text', async () => {
    const req = { json: async () => ({ mode: 'generate' }) } as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns error for missing mode', async () => {
    const req = { json: async () => ({ text: 'Did X' }) } as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns error for invalid mode', async () => {
    const req = { json: async () => ({ text: 'Did X', mode: 'foo' }) } as Request;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('handles Gemini error', async () => {
    mockGemini.mockRejectedValue(new Error('fail'));
    const req = { json: async () => ({ text: 'Did X', mode: 'generate' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toMatch(/fail/);
  });

  it('handles non-Error exceptions', async () => {
    mockGemini.mockRejectedValue('string error');
    const req = { json: async () => ({ text: 'Did X', mode: 'generate' }) } as Request;
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(500);
    expect(data.error).toBe('AI error');
  });
});
