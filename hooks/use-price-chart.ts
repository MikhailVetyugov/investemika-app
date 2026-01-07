import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

import { TChartDataInternalResponse } from '@/types/response/internal';
import { useBreakpointMatch } from './use-breakpoint-match';

export const usePriceChart = (data: TChartDataInternalResponse) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>(null);

  const isLargeScreen = useBreakpointMatch('--breakpoint-lg');

  useEffect(() => {
    if (chartRef.current && data) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const { labels, values } = data;

      const ctx = chartRef.current.getContext('2d') as CanvasRenderingContext2D;
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Цена закрытия',
            data: values,
            borderWidth: isLargeScreen ? 3 : 2,
            borderColor: 'rgb(0, 68, 106)',
            backgroundColor: 'rgba(0, 68, 106, 0.4)',
            tension: 0.1,
            fill: true,
            pointRadius: isLargeScreen ? 2 : 0,
            pointHoverRadius: isLargeScreen ? 5 : 0,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              position: 'left',
              title: {
                display: true,
                text: 'Цена закрытия'
              }
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: isLargeScreen,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return `Цена: ${context.parsed.y}`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isLargeScreen]);

  return chartRef;
}
