import { TCompany } from "./company";
import { TTicker } from "./ticker";

export interface IStock {
  name: string;
  ticker: TTicker;
  company: TCompany;
  /* Тикер акции, первой в списке. */
  firstCompanyTicker: TTicker;
}
