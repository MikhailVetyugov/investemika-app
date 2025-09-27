import { TCompany } from "@/types/company";

export const getNetCommissionIncome = (company: TCompany, yearIndex = 0) => {
  if ('commissionIncomes' in company && 'commissionExpenses' in company) {
    return company.commissionIncomes[yearIndex] - company.commissionExpenses[yearIndex];
  }

  return null;
};
