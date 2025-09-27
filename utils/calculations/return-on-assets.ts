import { IStock } from "@/types/stock";

export const getROA = ({ company }: IStock) => {
  return Math.round((company.shareholdersNetIncomes[0] / company.totalAssets[0]) * 1000) / 1000;
}
