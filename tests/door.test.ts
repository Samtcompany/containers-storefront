import { describe, expect, it } from 'vitest';
import { door, e164, minorText, prototype } from '../src/lib/door';

describe('prototype door (integrated experience only)', () => {
  it('is off in a normal build: no door, so the live site keeps posting to Aamer', () => {
    expect(prototype).toBe(false);
    expect(door()).toBeNull();
  });
  it('formats money from integer minor units, never a float', () => {
    expect(minorText(29600000)).toBe('296,000.00');
    expect(minorText(5)).toBe('0.05');
    expect(minorText(-123456)).toBe('-1,234.56');
    expect(minorText(0.5)).toBe('—');
    expect(minorText(Number.MAX_SAFE_INTEGER + 1)).toBe('—');
  });
  it('takes a Saudi mobile as 05XXXXXXXX and nothing else', () => {
    expect(e164('0512345678')).toBe('+966512345678');
    expect(e164(' 0512345678 ')).toBe('+966512345678');
    expect(e164('512345678')).toBeNull();
    expect(e164('0612345678')).toBeNull();
  });
});
