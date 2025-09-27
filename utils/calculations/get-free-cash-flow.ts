import { TCompany } from "@/types/company";
import { isFinancialCompany } from "@/utils/is-financial-company";

export const getFCF = (company: TCompany, yearIndex = 0) => {
  const isFCFCompany = !isFinancialCompany(company);

  if (isFCFCompany && company.tangibleAssetsExpenditure && company.intangibleAssetsExpenditure) {
    return company.operatingCashFlow[yearIndex] - company.tangibleAssetsExpenditure[yearIndex] - company.intangibleAssetsExpenditure[yearIndex];
  }

  return null;
};
