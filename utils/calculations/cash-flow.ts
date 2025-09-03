import { TCompany } from "@/types/company";

export const getFCF = (company: TCompany, yearIndex = 0) => {
  const isFCFCompany =  company.type === 'regular' || company.type === 'exchange';

  if (isFCFCompany && company.tangibleAssetsExpenditure && company.intangibleAssetsExpenditure) {
    return company.operatingCashFlow[yearIndex] - company.tangibleAssetsExpenditure[yearIndex] - company.intangibleAssetsExpenditure[yearIndex];
  }

  return null;
};
