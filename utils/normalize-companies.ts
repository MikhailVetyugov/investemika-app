import { INoDataCompany, TCompany } from "@/types/company";

export const normalizeCompanies = (companies: Array<TCompany | INoDataCompany>): TCompany[] => {
  return companies.map<TCompany>(item => {
    if ('dataId' in item) {
      const { dataId, type, ...restItem } = item;
      const dataCompany = companies.find(dataItem => dataItem.id === item.dataId) as TCompany;
      
      return {
        ...dataCompany,
        ...restItem,
      };
    }

    return item;
  });
};
