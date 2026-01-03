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
        company,
        firstCompanyTicker: company.tickers[0],
      };
    })
  });
};
