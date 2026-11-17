import { RUR_CURRENCY_RATE } from "@/constants/currencies";
import { IScreenerRow } from "@/types/screener";
import { IStock } from "@/types/stock";
import { getCurrentRatio } from "@/utils/calculations/current-ratio";
import { getFCF } from "@/utils/calculations/get-free-cash-flow";
import { getROA } from "@/utils/calculations/return-on-assets";
import { getROE } from "@/utils/calculations/return-on-equity";
import { getUrlNameByStock } from "@/utils/transliteration/get-url-name-by-stock";

const BILLION = 1_000_000_000;

const round = (value: number, digits: number) => {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
};

const finiteOrNull = (value: number | null | undefined) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

/** Доля `numerator` в `denominator` в процентах. Имеет смысл только при положительном знаменателе. */
const getShare = (numerator: number | null | undefined, denominator: number | null | undefined) => {
  if (typeof numerator !== 'number' || typeof denominator !== 'number' || denominator <= 0) {
    return null;
  }

  return finiteOrNull(round((numerator / denominator) * 100, 1));
};

/**
 * Рост показателя к предыдущему году в процентах.
 * Считается, только если два последних года идут подряд и база положительная.
 */
const getGrowth = (values: number[] | undefined, years: number[]) => {
  if (!values || values.length < 2 || years[0] - years[1] !== 1 || values[1] <= 0) {
    return null;
  }

  return finiteOrNull(round(((values[0] - values[1]) / values[1]) * 100, 1));
};

/**
 * Строки скринера: по одной на компанию, показатели за последний отчётный год.
 * Абсолютные значения приводятся к млрд рублей. Для компаний с отчётностью в долларах
 * нужен курс: если его нет (`usdRate === null`), абсолютные показатели таких компаний равны null.
 */
export const getScreenerRows = (stocks: IStock[], usdRate: number | null): IScreenerRow[] => {
  return stocks
    .filter(stock => stock.ticker === stock.firstCompanyTicker)
    .map(stock => {
      const { company } = stock;
      const currency = company.currency ?? 'RUR';
      const rate = currency === 'USD' ? usdRate : RUR_CURRENCY_RATE;

      const toBillions = (value: number | null | undefined) => {
        if (typeof value !== 'number' || rate === null) {
          return null;
        }

        return finiteOrNull(round((value * company.units * rate) / BILLION, 2));
      };

      const revenues = 'revenues' in company ? company.revenues : undefined;
      const operatingIncomes = 'operatingIncomes' in company ? company.operatingIncomes : undefined;

      const revenue = revenues?.[0];
      const operatingIncome = operatingIncomes?.[0];
      const netIncome = company.shareholdersNetIncomes[0];
      const totalAssets = company.totalAssets[0];
      const equity = company.shareholdersEquity[0];

      return {
        id: company.id,
        name: company.name,
        tickers: company.tickers,
        urlName: getUrlNameByStock(stock),
        industry: company.industry,
        year: company.years[0],
        currency,
        metrics: {
          revenue: toBillions(revenue),
          operatingIncome: toBillions(operatingIncome),
          netIncome: toBillions(netIncome),
          totalAssets: toBillions(totalAssets),
          equity: toBillions(equity),
          fcf: toBillions(getFCF(company)),
          // При нулевом или отрицательном капитале ROE не имеет смысла.
          roe: equity > 0 ? finiteOrNull(round(getROE(stock) * 100, 1)) : null,
          roa: totalAssets > 0 ? finiteOrNull(round(getROA(stock) * 100, 1)) : null,
          operatingMargin: getShare(operatingIncome, revenue),
          netMargin: getShare(netIncome, revenue),
          currentRatio: finiteOrNull(getCurrentRatio(stock)),
          equityRatio: getShare(company.totalEquity[0], totalAssets),
          revenueGrowth: getGrowth(revenues, company.years),
          netIncomeGrowth: getGrowth(company.shareholdersNetIncomes, company.years),
        },
      };
    });
};
