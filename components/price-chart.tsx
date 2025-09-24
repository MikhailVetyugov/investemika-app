import { LoaderCircle } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';

import { usePriceChart } from '@/hooks/use-price-chart';
import { fetchChartDataFromAPI } from '@/services/api';
import { TChartDataInternalResponse } from '@/types/response/internal';
import { TTicker } from '@/types/ticker';

interface IPriceChartProps {
  ticker: TTicker;
}

export const PriceChart: React.FC<IPriceChartProps> = memo(({ ticker }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TChartDataInternalResponse>(null);
  const chartRef = usePriceChart(data);

  useEffect(() => {
    fetchChartDataFromAPI(ticker)
      .then(data => setData(data))
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="h-[250px] w-full lg:h-[500px] flex items-center justify-center">
      {data && <canvas ref={chartRef} />}
      {loading && <LoaderCircle className="size-12 animate-spin text-investemika-primary" />}
      {!loading && !data && <p className="text-center">Произошла ошибка при загрузке графика.</p>}
    </div>
  );
});

PriceChart.displayName = 'PriceChart';
