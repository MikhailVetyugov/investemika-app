import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SCREENER_UNIT_LABELS } from "@/constants/screener-metrics";
import { NBSP } from "@/constants/symbols";
import { IScreenerMetric, IScreenerRow, IScreenerSort, TScreenerSortKey } from "@/types/screener";
import { formatMetricValue } from "@/utils/screener/format";
import { CompanyMeta, CompanyTickers } from "./company-info";

interface IResultsTableProps {
  rows: IScreenerRow[];
  metrics: IScreenerMetric[];
  sort: IScreenerSort;
  onSortClick: (key: TScreenerSortKey) => void;
}

interface ISortButtonProps {
  sortKey: TScreenerSortKey;
  sort: IScreenerSort;
  title?: string;
  className?: string;
  children: React.ReactNode;
  onClick: (key: TScreenerSortKey) => void;
}

const SortButton: React.FC<ISortButtonProps> = ({ sortKey, sort, title, className = '', children, onClick }) => {
  const isActive = sort.key === sortKey;
  const Icon = !isActive ? ArrowUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      title={title}
      className={`inline-flex items-center gap-1 font-bold cursor-pointer hover:text-investemika-primary ${isActive ? 'text-investemika-primary' : ''} ${className}`}
      onClick={() => onClick(sortKey)}
    >
      {children}
      <Icon className={`size-3.5 shrink-0 ${isActive ? '' : 'opacity-40'}`} aria-hidden />
    </button>
  );
};

const getAriaSort = (sortKey: TScreenerSortKey, sort: IScreenerSort) => {
  if (sort.key !== sortKey) return 'none';

  return sort.direction === 'asc' ? 'ascending' : 'descending';
};

// Первая колонка закреплена при горизонтальной прокрутке, поэтому ей нужен непрозрачный фон.
const STICKY_CELL_CLASS_NAME = 'sticky left-0 z-10 bg-background';

export const ResultsTable: React.FC<IResultsTableProps> = ({ rows, metrics, sort, onSortClick }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={`${STICKY_CELL_CLASS_NAME} h-auto py-2 align-top`} aria-sort={getAriaSort('name', sort)}>
            <SortButton sortKey="name" sort={sort} onClick={onSortClick}>Компания</SortButton>
          </TableHead>
          {metrics.map(metric => (
            <TableHead key={metric.id} className="h-auto py-2 text-right align-top" aria-sort={getAriaSort(metric.id, sort)}>
              <SortButton sortKey={metric.id} sort={sort} title={metric.description} onClick={onSortClick}>
                {metric.shortTitle}
              </SortButton>
              {/* Единица измерения отдельной строкой, чтобы колонки были уже. */}
              <span className="block pr-[18px] text-xs font-normal text-muted-foreground">
                {SCREENER_UNIT_LABELS[metric.unit] || NBSP}
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id} className="hover:bg-transparent">
            <TableCell className={`${STICKY_CELL_CLASS_NAME} min-w-[220px] max-w-[280px]`}>
              <span className="flex items-center gap-2">
                <Link
                  href={`/${row.urlName}`}
                  className="font-medium text-investemika-primary underline-offset-4 hover:underline whitespace-normal"
                >
                  {row.name}
                </Link>
                <CompanyTickers row={row} />
              </span>
              <CompanyMeta row={row} />
            </TableCell>
            {metrics.map(metric => {
              const value = row.metrics[metric.id];

              return (
                <TableCell
                  key={metric.id}
                  className={`pr-[26px] text-right tabular-nums ${value === null ? 'text-muted-foreground' : value < 0 ? 'text-red-600' : ''}`}
                >
                  {formatMetricValue(value, metric.unit)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
