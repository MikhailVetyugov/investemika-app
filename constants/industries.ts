import { NBSP } from "@/constants/symbols";
import { TIndustry } from "@/types/industry";

/** Русские названия отраслей для заголовков и перелинковки. */
export const INDUSTRY_NAMES: Record<TIndustry, string> = {
  banks: 'Банки',
  oilAndGas: `Нефть и${NBSP}газ`,
  oilAndGasServices: 'Нефтегазовые услуги',
  metalsAndMining: `Металлургия и${NBSP}добыча`,
  it: 'IT',
  electricPower: 'Электроэнергетика',
  telecommunications: 'Телекоммуникации',
  foodPharmaRetail: 'Ритейл',
  insurance: 'Страхование',
  investmentServices: 'Инвестиционные услуги',
  investmentHoldings: 'Инвестиционные холдинги',
  chemicalIndustry: 'Химическая промышленность',
  agriculture: 'Сельское хозяйство',
  constructionDevelopers: 'Застройщики',
  recruitment: 'Рекрутинг',
  passengerTransportation: 'Пассажирские перевозки',
  maritimeTransportation: 'Морские перевозки',
  healthcare: 'Здравоохранение',
  'e-commerce': 'Электронная коммерция',
};
