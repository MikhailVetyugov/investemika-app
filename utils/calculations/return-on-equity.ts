import { IStock } from "@/types/stock";

export const getROE = ({ company }: IStock) => {
  return Math.round((company.shareholdersNetIncomes[0] / company.shareholdersEquity[0]) * 1000) / 1000;
}
