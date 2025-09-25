import { IStock } from "@/types/stock";

export const getCurrentRatio = ({ company }: IStock) => {
  if ('currentAssets' in company) {
    return Math.round((company.currentAssets[0] / company.currentLiabilities[0]) * 10) / 10;
  }

  return null;
}
