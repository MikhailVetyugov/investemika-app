import { IStock } from "@/types/stock";

export const getStockPageSeoTitle = (stock: IStock) => {
  return `${stock.name} (${stock.ticker}) | Финансовые показатели по МСФО и мультипликаторы`;
}
