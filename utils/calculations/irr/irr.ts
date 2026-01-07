import { irr, RootFinderMethod } from 'node-irr';

export const calculateIRR = (cashFlows: number[]): number | null => {
  if (cashFlows.length < 2) {
    return null;
  }

  const hasPositive = cashFlows.some(cf => cf > 0);
  const hasNegative = cashFlows.some(cf => cf < 0);

  if (!hasPositive || !hasNegative) {
    return null;
  }

  try {
    const result = irr(cashFlows, { method: RootFinderMethod.Bisection, fallbackMethod: RootFinderMethod.Newton, epsilon: 0.0001 });
    
    if (!isFinite(result)) {
      return null;
    }

    if (result <= -0.9999) {
      return null;
    }
    
    return result;
  } catch (error) {
    console.error('Ошибка при расчете IRR:', error);
    return null;
  }
};
