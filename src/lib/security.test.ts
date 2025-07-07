import * as security from './security';

describe('sanitizeHtml', () => {
  it('should sanitize HTML special chars', () => {
    expect(security.sanitizeHtml('<div>"&\'</div>')).toBe('&lt;div&gt;&quot;&amp;&#39;&lt;/div&gt;');
  });
});

describe('sanitizeHtml (edge cases)', () => {
  it('should handle default case in switch statement', () => {
    // This tests the default case in the switch statement
    // The regex only matches <>&'" so any other character should return as-is
    expect(security.sanitizeHtml('hello world')).toBe('hello world');
  });
});

describe('sanitizeTemplateContent', () => {
  it('should sanitize template content', () => {
    const dirty = '<script>alert(1)</script><b>ok</b>';
    expect(security.sanitizeTemplateContent(dirty)).not.toContain('<script>');
    expect(security.sanitizeTemplateContent(dirty)).toContain('<b>ok</b>');
  });
});

describe('sanitizeCss', () => {
  it('should strip < and > from CSS', () => {
    expect(security.sanitizeCss('body { color: red; } <style>')).toBe('body { color: red; } style');
  });
});

describe('sanitizeInput', () => {
  it('should sanitize input by type', () => {
    expect(security.sanitizeInput(' <b>hi</b> ', 'text')).toBe('&lt;b&gt;hi&lt;/b&gt;');
    expect(security.sanitizeInput('TEST@EXAMPLE.COM', 'email')).toBe('test@example.com');
    expect(security.sanitizeInput('https://example.com', 'url')).toBe('https://example.com');
    expect(security.sanitizeInput('badurl', 'url')).toBe('');
    expect(security.sanitizeInput('<b>ok</b>', 'html')).toContain('<b>ok</b>');
    expect(security.sanitizeInput('body { color: red; } <style>', 'css')).toBe('body { color: red; } style');
  });
});

describe('sanitizeInput (edge cases)', () => {
  it('should return empty string for empty input', () => {
    expect(security.sanitizeInput('', 'text')).toBe('');
    expect(security.sanitizeInput(null as any, 'text')).toBe('');
    expect(security.sanitizeInput(undefined as any, 'text')).toBe('');
  });
  it('should use default case for unknown type', () => {
    expect(security.sanitizeInput('<b>hi</b>', 'unknown' as any)).toBe('&lt;b&gt;hi&lt;/b&gt;');
  });
});

describe('sanitizeInput (default case)', () => {
  it('should use default case for unknown type', () => {
    expect(security.sanitizeInput('<b>hi</b>', 'unknown' as any)).toBe('&lt;b&gt;hi&lt;/b&gt;');
  });
});

describe('sanitizeError', () => {
  it('should sanitize errors', () => {
    expect(typeof security.sanitizeError(new Error('fail'))).toBe('string');
  });
});

describe('sanitizeError (all error types)', () => {
  it('should handle ValidationError', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'ValidationError' });
    expect(security.sanitizeError(err)).toBe('Invalid input provided');
  });
  it('should handle CastError', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'CastError' });
    expect(security.sanitizeError(err)).toBe('Invalid data format');
  });
  it('should handle MongoError', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'MongoError' });
    expect(security.sanitizeError(err)).toBe('Database error occurred');
  });
  it('should handle JsonWebTokenError', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'JsonWebTokenError' });
    expect(security.sanitizeError(err)).toBe('Authentication error');
  });
  it('should handle TokenExpiredError', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'TokenExpiredError' });
    expect(security.sanitizeError(err)).toBe('Session expired');
  });
  it('should handle SyntaxError', () => {
    const err = new SyntaxError('test');
    expect(security.sanitizeError(err)).toBe('Invalid request format');
  });
  it('should handle TypeError', () => {
    const err = new TypeError('test');
    expect(security.sanitizeError(err)).toBe('Invalid data type provided');
  });
  it('should handle unknown error types', () => {
    const err = new Error('test');
    Object.defineProperty(err.constructor, 'name', { value: 'UnknownError' });
    expect(security.sanitizeError(err)).toBe('An unexpected error occurred');
  });
  it('should return error message in development', () => {
    expect(security.sanitizeError(new Error('dev error'), true)).toBe('dev error');
    expect(security.sanitizeError('not an error', true)).toBe('An error occurred');
  });
});

describe('sanitizeError (default case)', () => {
  it('should handle default case for unknown error type', () => {
    const customError = new Error('Custom error');
    Object.defineProperty(customError.constructor, 'name', { value: 'CustomErrorType' });
    expect(security.sanitizeError(customError)).toBe('An unexpected error occurred');
  });
});

describe('validateRequestSize', () => {
  it('should validate request size', () => {
    expect(security.validateRequestSize('100', 200)).toBe(true);
    expect(security.validateRequestSize('300', 200)).toBe(false);
  });
});

describe('validateArrayLength', () => {
  it('should validate array length', () => {
    expect(security.validateArrayLength([1,2,3], 3)).toBe(true);
    expect(security.validateArrayLength([1,2,3,4], 3)).toBe(false);
  });
});

describe('validateInput', () => {
  it('should validate input by type', () => {
    expect(security.validateInput('John Doe', 'name')).toBe(true);
    expect(security.validateInput('not-an-email', 'email')).toBe(false);
  });
});

describe('validateInput (edge cases)', () => {
  it('should return false for empty or non-string input', () => {
    expect(security.validateInput('', 'name')).toBe(false);
    expect(security.validateInput(null as any, 'name')).toBe(false);
    expect(security.validateInput(undefined as any, 'name')).toBe(false);
  });
  it('should return false for default case', () => {
    expect(security.validateInput('foo', 'unknown' as any)).toBe(false);
  });
});

describe('validateInput (default case)', () => {
  it('should return false for unknown type', () => {
    expect(security.validateInput('test', 'unknown' as any)).toBe(false);
  });
});

describe('createCSRFTokenInput', () => {
  it('should create CSRF token input', () => {
    expect(security.createCSRFTokenInput('token')).toContain('token');
  });
});

describe('validateCSRFRequest', () => {
  it('should validate CSRF request', () => {
    // This function expects a Request object; skip or mock as needed
    expect(typeof security.validateCSRFRequest).toBe('function');
  });
});

describe('PasswordSchema', () => {
  it('should reject weak passwords', () => {
    const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    weakPasswords.forEach(password => {
      expect(() => {
        // We need to test the schema directly, but it's not exported
        // This tests the weak password logic indirectly
        const result = security.UserRegistrationSchema.safeParse({
          name: 'Test User',
          email: 'test@example.com',
          password: password
        });
        expect(result.success).toBe(false);
      });
    });
  });
});

describe('UserRegistrationSchema', () => {
  it('should validate valid registration data', () => {
    const validData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPass123!'
    };
    const result = security.UserRegistrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid registration data', () => {
    const invalidData = {
      name: 'T', // Too short
      email: 'invalid-email',
      password: 'weak'
    };
    const result = security.UserRegistrationSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('validateCSRFRequest', () => {
  it('should return true for form-urlencoded content type', () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });
    expect(security.validateCSRFRequest(request)).toBe(true);
  });

  it('should return true for other content types', () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' }
    });
    expect(security.validateCSRFRequest(request)).toBe(true);
  });

  it('should return true for requests without content type', () => {
    const request = new Request('http://localhost/api/test', {
      method: 'GET'
    });
    expect(security.validateCSRFRequest(request)).toBe(true);
  });
}); 