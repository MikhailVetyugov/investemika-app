import { describe, it, expect } from 'vitest'
import { calculateIRR } from '../irr';

describe('calculateIRR', () => {
  it.each([
    { cashFlows: [-1000, 500, 500, 500, 500, 500], expected: 0.4104 },
    { cashFlows: [-1000, 500, 500, 300, 500, 500], expected: 0.3662 },
    { cashFlows: [-1000, 500, 500, 500, 300, 500], expected: 0.3786 },
    { cashFlows: [-1000, 3000, -2000], expected: 1.00 },
    { cashFlows: [-1000, 3000, -1900], expected: 1.0916 },
    { cashFlows: [-1000, 3000, -2001], expected: null },
    { cashFlows: [-4000, 3000], expected: -0.25 },
  ])('should return IRR (cashFlows: $cashFlows)', ({ cashFlows, expected }) => {
    const value = calculateIRR(cashFlows);
    
    if (expected === null) {
      expect(value).toBeNull();
    } else {
      expect(Math.round(value as number * 10000) / 10000).toBe(expected);
    }
  });
});
