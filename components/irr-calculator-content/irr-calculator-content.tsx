'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { calculateIRR } from '@/utils/calculations/irr';
import { NBSP } from '@/constants/symbols';
import { useBreakpointMatch } from '@/hooks/use-breakpoint-match';

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: true,
});

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const INITIAL_CASH_FLOWS = ['-1000', '500', '500', '300'];

export const IRRCalculatorContent: React.FC = () => {
  const [cashFlows, setCashFlows] = useState<string[]>(INITIAL_CASH_FLOWS);
  const [irr, setIrr] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addPeriod = () => {
    setCashFlows([...cashFlows, '0']);
  };

  const removePeriod = (index: number) => {
    if (cashFlows.length <= 2) {
      setError('Должен остаться хотя бы один период кроме начального');
      return;
    }

    const newFlows = [...cashFlows];
    newFlows.splice(index, 1);
    setCashFlows(newFlows);
  };

  const updateCashFlow = (index: number, value: string) => {
    const newFlows = [...cashFlows];
    newFlows[index] = value;
    setCashFlows(newFlows);
  };

  useEffect(() => {
    setError(null);
    setIrr(null);

    const numericFlows: number[] = [];
    
    for (let i = 0; i < cashFlows.length; i++) {
      const value = parseFloat(cashFlows[i]);
      
      if (isNaN(value)) {
        setError(`Период ${i}: введите корректное число`);
        return;
      }

      if (i == 0 && value >= 0) {
        setError('Начальные инвестиции должны быть отрицательными');
        return;
      }
      
      if (Math.abs(value) > 1_000_000_000) {
        setError(`Период ${i}: значение не должно превышать 1 млрд`);
        return;
      }
      
      numericFlows.push(value);
    }

    const hasPositive = numericFlows.some(cf => cf > 0);
    const hasNegative = numericFlows.some(cf => cf < 0);
    
    if (!hasPositive || !hasNegative) {
      setError('Для расчета IRR нужны как минимум один отрицательный (инвестиция) и один положительный денежный поток');
      return;
    }

    const calculatedIRR = calculateIRR(numericFlows);
    
    if (calculatedIRR === null) {
      setError(`Не удалось рассчитать IRR с${NBSP}использованием представленных данных.`);
      return;
    }

    setIrr(calculatedIRR);
  }, [cashFlows]);

  const isMediumScreen = useBreakpointMatch('--breakpoint-md');

  return (
    <div className="container max-w-2xl self-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Калькулятор IRR (внутренней нормы доходности)
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Расчет доходности инвестиционного проекта с{NBSP}неравномерными денежными потоками
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Денежные потоки по{NBSP}периодам</Label>
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={addPeriod}
              >
                <Plus className="h-4 w-4" />
                {isMediumScreen && 'Добавить период'}
              </Button>
            </div>
            
            <div className="space-y-2">
              {cashFlows.map((cashFlow, index) => (
                <div key={index} className="flex items-center md:gap-2">
                  <div className={`${index === 0 ? 'w-40' : 'w-20'}`}>
                    <Label htmlFor={`period-${index}`} className="text-sm">
                      Период {index}
                      {index === 0 && (
                        <span className="block text-xs text-muted-foreground">
                          (инвестиция)
                        </span>
                      )}
                    </Label>
                  </div>
                  <div className="flex-1">
                    <Input
                      id={`period-${index}`}
                      type="number"
                      step="0.01"
                      value={cashFlow}
                      onChange={(e) => updateCashFlow(index, e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  {index > 0 && cashFlows.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePeriod(index)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>* Период 0 содержит начальные инвестиции (отрицательное значение)</p>
              <p>* Последующие периоды — денежные потоки от проекта (обычно положительные)</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {irr !== null && !error && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">Внутренняя норма доходности (IRR)</p>
                <p className="text-2xl md:text-3xl font-bold text-investemika-primary overflow-hidden">
                  {numberFormatter.format(irr)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-sm text-muted-foreground">Число периодов</p>
                  <p className="text-lg font-semibold">{cashFlows.length}</p>
                </div>
                <div className="rounded-lg border p-2 text-center">
                  <p className="text-sm text-muted-foreground">Начальные инвестиции</p>
                  <p className="text-lg font-semibold">
                    {currencyFormatter.format(parseFloat(cashFlows[0]) || 0)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground border-t pt-4 mt-4 space-y-2">
            <p>
              <strong>IRR (Internal Rate of Return)</strong> — это процентная ставка, при которой чистая приведенная стоимость (NPV) всех денежных потоков от инвестиционного проекта равна нулю.
            </p>
            <p>
              <strong>Формула:</strong> NPV = Σ [CFₜ / (1 + IRR)ᵗ] = 0, где CFₜ — денежный поток в период t
            </p>
            <p>
              Проект считается привлекательным, если IRR превышает требуемую инвестором доходность.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
