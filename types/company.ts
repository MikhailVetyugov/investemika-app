export interface ICompany {
  id: number,
  name: 'Лукойл',
  units: '(в млн. рублей)',
  years: [number, number, number, number, ...number[]];
  revenues: [number, number, number, number, ...number[]];
  operatingIncomes: [number, number, number, number, ...number[]];
  netIncomes: [number, number, number, number, ...number[]];
  shareCapital: [number, number, number, number, ...number[]];
  cachFlowChange:[number, number, number, number, ...number[]];
}
