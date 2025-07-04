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

  it('prioritizes resume content over job title', async () => {
    mockGemini.mockResolvedValue('React, Node.js, TypeScript');
    const req = { json: async () => ({ 
      resumeContent: 'Frontend Developer with React and TypeScript experience',
      jobTitle: 'Backend Developer',
      industry: 'Finance'
    }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Frontend Developer with React and TypeScript'));
    expect(data.skills).toEqual(['React', 'Node.js', 'TypeScript']);
  });

  it('falls back to experience descriptions when no full resume content', async () => {
    mockGemini.mockResolvedValue('Python, Django, PostgreSQL');
    const req = { json: async () => ({ 
      experienceDescriptions: 'Built web apps using Python Django framework with PostgreSQL database',
      jobTitle: 'Data Scientist'
    }) } as any;
    const res = await POST(req);
    const data = await res.json();
    expect(mockGemini).toHaveBeenCalledWith(expect.stringContaining('Built web apps using Python Django'));
    expect(data.skills).toEqual(['Python', 'Django', 'PostgreSQL']);
  });
});
