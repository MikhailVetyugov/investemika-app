'use client';
import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { NBSP } from '@/constants/symbols';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const EVACalculatorContent: React.FC = () => {
  const [nopat, setNopat] = useState<string>('1000000');
  const [investedCapital, setInvestedCapital] = useState<string>('5000000');
  const [wacc, setWacc] = useState<string>('10');

  const [eva, setEva] = useState<number | null>(null);
  const [costOfCapital, setCostOfCapital] = useState<number | null>(null);
  const [roic, setRoi] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setEva(null);
    setCostOfCapital(null);
    setRoi(null);

    const parsedNopat = parseFloat(nopat);
    const parsedInvestedCapital = parseFloat(investedCapital);
    const parsedWacc = parseFloat(wacc);

    if (isNaN(parsedNopat) || isNaN(parsedInvestedCapital) || isNaN(parsedWacc)) {
      setError('Пожалуйста, введите корректные числа.');
      return;
    }

    if (parsedInvestedCapital <= 0) {
      setError('Инвестированный капитал должен быть больше 0.');
      return;
    }

    if (parsedNopat < 0) {
      setError('NOPAT не может быть отрицательным.');
      return;
    }

    if (parsedWacc < 0 || parsedWacc > 100) {
      setError('WACC должен находиться в диапазоне от 0 до 100%.');
      return;
    }

    if (parsedNopat > 10_000_000_000 || parsedInvestedCapital > 10_000_000_000) {
      setError('Значения не должны превышать 10 млрд ₽.');
      return;
    }

    const capitalCost = parsedInvestedCapital * (parsedWacc / 100);
    const calculatedEva = parsedNopat - capitalCost;
    const calculatedRoi = parsedNopat / parsedInvestedCapital;

    setEva(calculatedEva);
    setCostOfCapital(capitalCost);
    setRoi(calculatedRoi);
  }, [nopat, investedCapital, wacc]);

  return (
    <div className="container max-w-2xl self-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Калькулятор EVA
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Расчет экономической добавленной стоимости компании
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 items-end">
            <div className="grid gap-2">
              <Label htmlFor="nopat">Чистая операционная прибыль после{NBSP}налогов (NOPAT), ₽</Label>
              <Input
                id="nopat"
                type="number"
                step="0.01"
                min="0"
                value={nopat}
                onChange={(e) => setNopat(e.target.value)}
                placeholder="1000000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="investedCapital">Инвестированный капитал, ₽</Label>
              <Input
                id="investedCapital"
                type="number"
                step="0.01"
                min="0"
                value={investedCapital}
                onChange={(e) => setInvestedCapital(e.target.value)}
                placeholder="5000000"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="wacc">Средневзвешенная стоимость капитала (WACC), %</Label>
            <Input
              id="wacc"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={wacc}
              onChange={(e) => setWacc(e.target.value)}
              placeholder="10"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {eva !== null && !error && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Экономическая добавленная стоимость (EVA)</p>
                <p className={`text-2xl md:text-3xl font-bold overflow-hidden ${eva >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currencyFormatter.format(eva)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {eva >= 0
                    ? 'Компания создает стоимость сверх требуемой доходности'
                    : 'Компания не покрывает стоимость привлеченного капитала'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Стоимость капитала</p>
                  <p className="text-lg font-semibold">{currencyFormatter.format(costOfCapital ?? 0)}</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-sm text-muted-foreground">Рентабельность капитала (ROIC)</p>
                  <p className="text-lg font-semibold">{percentFormatter.format(roic ?? 0)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground border-t pt-4 mt-4 space-y-2">
            <p>
              <strong>Формула:</strong> EVA = NOPAT − (Инвестированный капитал × WACC)
            </p>
            <p>
              EVA показывает реальную экономическую прибыль. Если EVA &gt; 0, бизнес создает дополнительную стоимость для{NBSP}акционеров. Если EVA &lt; 0, капитал используется неэффективно, даже при{NBSP}наличии бухгалтерской прибыли.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
