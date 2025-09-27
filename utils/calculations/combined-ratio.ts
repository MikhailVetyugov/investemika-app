import { IStock } from "@/types/stock";

export const getCombinedRatio = ({ company }: IStock) => {
  if (company.type == 'insurance') {
    const lossesAndExpenses = company.netIncurredLosses[0] + company.acquisitionCosts[0] + company.administrativeCosts[0];

    return Math.round((lossesAndExpenses / company.netEarnedPremiums[0]) * 1000) / 1000;
  }

  return null;
}
