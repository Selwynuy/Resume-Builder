const OLD_ENV = process.env;

describe('getGeminiCompletion', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should throw if GEMINI_API_KEY is not set', async () => {
    process.env.GEMINI_API_KEY = '';
    jest.resetModules();
    const { getGeminiCompletion } = require('./gemini');
    await expect(getGeminiCompletion('test')).rejects.toThrow('GEMINI_API_KEY not set in environment');
  });

  it('should return a string on success', async () => {
    process.env.GEMINI_API_KEY = 'fake-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text: 'AI result' }] } }] })
    });
    jest.resetModules();
    const { getGeminiCompletion } = require('./gemini');
    const result = await getGeminiCompletion('test');
    expect(result).toBe('AI result');
  });

  it('should throw on API error', async () => {
    process.env.GEMINI_API_KEY = 'fake-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      text: async () => 'API error!'
    });
    jest.resetModules();
    const { getGeminiCompletion } = require('./gemini');
    await expect(getGeminiCompletion('test')).rejects.toThrow('Failed to get AI completion');
  });
}); 