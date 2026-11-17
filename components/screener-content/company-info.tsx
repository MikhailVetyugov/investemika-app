import { INDUSTRY_NAMES } from "@/constants/industries";
import { NBSP } from "@/constants/symbols";
import { IScreenerRow } from "@/types/screener";

interface IRowProps {
  row: IScreenerRow;
}

export const CompanyTickers: React.FC<IRowProps> = ({ row }) => (
  <span className="flex shrink-0 gap-1">
    {row.tickers.map(ticker => (
      <span key={ticker} className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{ticker}</span>
    ))}
  </span>
);

/** Вторая строка под названием компании: отрасль, отчётный год и пометка о валюте отчётности. */
export const CompanyMeta: React.FC<IRowProps> = ({ row }) => (
  <span className="block text-xs text-muted-foreground whitespace-normal">
    {INDUSTRY_NAMES[row.industry]} · {row.year}
    {row.currency === 'USD' && (
      <span title="Отчётность в долларах США, денежные показатели пересчитаны в рубли по текущему курсу ЦБ"> · отчётность{NBSP}в{NBSP}$</span>
    )}
  </span>
);
