'use client';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

const calculateGordonPrice = (d0: number, g: number, r: number): number => {
  // Все вычисления в копейках для точности
  const d0Kopecks = Math.round(d0 * 100);
  const d1Kopecks = Math.round(d0Kopecks * (1 + g / 100));
  
  const priceInKopecks = Math.round(d1Kopecks * 100 / (r - g));
  
  return priceInKopecks / 100;
};

export const GordonCalculatorContent: React.FC = () => {
  const [dividend0, setDividend0] = useState<string>('2.00');
  const [growthRate, setGrowthRate] = useState<string>('3');
  const [discountRate, setDiscountRate] = useState<string>('8');
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dividend1ToDisplay = parseFloat(dividend0) * (1 + parseFloat(growthRate) / 100);

  useEffect(() => {
    const d0 = parseFloat(dividend0);
    const g = parseFloat(growthRate) / 100;
    const r = parseFloat(discountRate) / 100;

    setError(null);
    setPrice(null);

    if (isNaN(d0) || isNaN(g) || isNaN(r)) {
      setError('Пожалуйста, введите корректные числа.');
      return;
    }

    if (1_000_000 < d0) {
      setError('Дивиденд не должен быть больше 1 000 000 ₽.');
      return;
    }

    if (r <= g) {
      setError('Ставка дисконтирования должна быть больше темпа роста (r > g).');
      return;
    }

    if (d0 < 0 || g < 0 || r < 0) {
      setError('Все значения должны быть неотрицательными.');
      return;
    }

    const d1 = d0 * (1 + g);
    const p = d1 / (r - g);
    setPrice(p);
  }, [dividend0, growthRate, discountRate]);

  return (
    <div className="container max-w-2xl self-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Калькулятор модели Гордона
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Оценка справедливой цены акции по дивидендной модели роста
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="dividend0">Текущий дивиденд (D₀), ₽</Label>
            <Input
              id="dividend0"
              type="number"
              step="0.01"
              min="0"
              value={dividend0}
              onChange={(e) => setDividend0(e.target.value)}
              placeholder="2.00"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="growthRate">Темп роста дивидендов (g), %</Label>
            <Input
              id="growthRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={growthRate}
              onChange={(e) => setGrowthRate(e.target.value)}
              placeholder="3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="discountRate">Требуемая доходность (r), %</Label>
            <Input
              id="discountRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              placeholder="8"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {price !== null && !error && (
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Справедливая цена (P)</p>
              <p className="text-2xl md:text-3xl font-bold text-investemika-primary overflow-hidden">
                {currencyFormatter.format(price)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                D₁ = {currencyFormatter.format(dividend1ToDisplay)}
              </p>
            </div>
          )}

          <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
            <p>
              <strong>Формула:</strong> P = D₁ / (r − g), <span className="whitespace-nowrap">где D₁ = D₀ × (1 + g)</span>
            </p>
            <p className="mt-1">
              Модель применима только при устойчивом темпе роста и r &gt; g.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
