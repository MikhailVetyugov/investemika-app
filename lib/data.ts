import { ICompany } from "@/types/company";

export const COMPANIES: ICompany[] = [
  {
    id: 1,
    name: 'Лукойл',
    units: '(в млн. рублей)',
    years: [2024, 2023, 2021, 2020],
    revenues: [8621561, 7928303, 9435143, 5639401],
    operatingIncomes: [1191817, 1427697, 978945, 281654],
    netIncomes: [851546, 1160271, 775513, 16633],
    shareCapital: [6892008, 6401233, 6864749, 5991579],
    cachFlowChange: [246591, 299475, 333650, -172200],
  },
];
