import { generateShortCode } from '../src/utils/generateShortCode.js';

describe('Generate Short Code Utils', () => {
  it('should generate a code of default length 6', () => {
    const code = generateShortCode();
    expect(code).toBeDefined();
    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);
  });

  it('should generate a code of specified length', () => {
    const code = generateShortCode(8);
    expect(code.length).toBe(8);
  });

  it('should generate random codes', () => {
    const code1 = generateShortCode();
    const code2 = generateShortCode();
    expect(code1).not.toBe(code2);
  });
});
