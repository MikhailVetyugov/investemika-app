export type TCompany = IIndustrialCompany | IBank;

interface ICompany {
  id: number,
  name: string,
  units: string,
  type: string;
  years: [number, number, number, number, ...number[]];
}

interface IIndustrialCompany extends ICompany {
  type: 'industrial';
  revenues: [number, number, number, number, ...number[]];
  operatingIncomes: [number, number, number, number, ...number[]];
  netIncomes: [number, number, number, number, ...number[]];
  shareCapital: [number, number, number, number, ...number[]];
  cashFlowChange:[number, number, number, number, ...number[]];
}

interface IBank extends ICompany {
  type: 'bank';
  netInterestIncomes: [number, number, number, number, ...number[]];
  operatingIncomes: [number, number, number, number, ...number[]];
  netIncomes: [number, number, number, number, ...number[]];
  shareCapital: [number, number, number, number, ...number[]];
}
