import Link from "next/link";

import { ALL_STOCKS, PREF_TICKERS } from "@/lib/data";
import { IStock } from "@/types/stock";
import { getCompanyStocks } from "@/utils/get-related-stocks";
import { getUrlNameByStock } from "@/utils/transliteration";

interface IStockTypeSwitchProps {
  stock: IStock;
}

const segmentClassName = "px-3 py-1.5 text-sm font-medium leading-tight whitespace-nowrap";

/** Переключатель между обыкновенными и привилегированными акциями одной компании. */
export const StockTypeSwitch: React.FC<IStockTypeSwitchProps> = ({ stock }) => {
  const companyStocks = getCompanyStocks(stock, ALL_STOCKS);

  if (companyStocks.length < 2) {
    return null;
  }

  return (
    <nav aria-label="Тип акций" className="flex w-fit rounded-md border border-investemika-primary overflow-hidden">
      {companyStocks.map(item => {
        const label = PREF_TICKERS.includes(item.ticker) ? 'Привилегированные' : 'Обыкновенные';

        if (item.ticker === stock.ticker) {
          return (
            <span key={item.ticker} aria-current="page" className={`${segmentClassName} bg-investemika-primary text-white`}>
              {label}
            </span>
          );
        }

        return (
          <Link
            key={item.ticker}
            href={`/${getUrlNameByStock(item)}`}
            title={item.name}
            className={`${segmentClassName} text-investemika-primary hover:bg-investemika-primary/10`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
