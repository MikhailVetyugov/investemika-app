import { TCompany } from "./company";
import { TTicker } from "./ticker";

export interface IStock {
  name: string;
  ticker: TTicker;
  company: TCompany;
}
