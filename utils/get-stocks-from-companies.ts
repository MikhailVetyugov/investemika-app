import { PREF_TICKERS } from "@/lib/data";
import { TCompany } from "@/types/company";
import { IStock } from "@/types/stock";

export const getStocksFromCompanies = (companies: TCompany[]): IStock[] => {
  return companies.flatMap(company => {
    return company.tickers.map(ticker => {

      const prefSuffix = PREF_TICKERS.includes(ticker) ? " - привилегированные акции" : "";

      return {
        name: `${company.name}${prefSuffix}`,
        ticker,
        company: restrictYears(company, 4),
        firstCompanyTicker: company.tickers[0],
      };
    })
  });
};

function restrictYears(company: TCompany, yearCount: number): TCompany {
  const result: TCompany = { ...company };

  for (const key of Object.keys(result) as Array<keyof TCompany>) {
    if (key === 'tickers') continue;
    
    const value = result[key];
    
    if (Array.isArray(value)) {
      // TS не может вывести корректный тип для левой части присваивания.
      // Приведение безопасно, т.к. проверка Array.isArray уже пройдена.
      (result as any)[key] = value.slice(0, yearCount);
    }
  }

  return result;
}
