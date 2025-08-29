import { TCompany } from "@/types/company";

export const getFCF = (company: TCompany, yearIndex = 0) => {
  if (company.type === 'regular' && company.tangibleAssetsExpenditure && company.intangibleAssetsExpenditure) {
    return company.operatingCashFlow[yearIndex] - company.tangibleAssetsExpenditure[yearIndex] - company.intangibleAssetsExpenditure[yearIndex];
  }

  return null;
};
