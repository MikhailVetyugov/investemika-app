import { TCompany } from "@/types/company";

export const isFinancialCompany = (company: TCompany) => company.type === "bank" || company.type === "insurance";
