import Link from "next/link";

import { IScreenerMetric, IScreenerRow } from "@/types/screener";
import { formatMetricValue, getMetricLabel } from "@/utils/screener/format";
import { CompanyMeta, CompanyTickers } from "./company-info";

interface IResultsCardsProps {
  rows: IScreenerRow[];
  metrics: IScreenerMetric[];
}

/** Результаты для узких экранов: карточка на компанию, вся карточка — ссылка. */
export const ResultsCards: React.FC<IResultsCardsProps> = ({ rows, metrics }) => {
  return (
    <ul className="flex flex-col gap-3">
      {rows.map(row => (
        <li key={row.id}>
          <Link
            href={`/${row.urlName}`}
            className="block rounded-md border p-3 transition-colors hover:border-investemika-primary"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="min-w-0 break-words font-medium text-investemika-primary">{row.name}</span>
              <CompanyTickers row={row} />
            </span>
            <CompanyMeta row={row} />
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {metrics.map(metric => {
                const value = row.metrics[metric.id];

                return (
                  <div key={metric.id} className="min-w-0">
                    <dt className="text-xs text-muted-foreground">{getMetricLabel(metric, true)}</dt>
                    <dd className={`text-sm tabular-nums ${value === null ? 'text-muted-foreground' : value < 0 ? 'text-red-600' : ''}`}>
                      {formatMetricValue(value, metric.unit)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
};
