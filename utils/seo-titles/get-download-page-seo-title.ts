import { IStock } from "@/types/stock";

export const getDownloadPageSeoTitle = (stock: IStock) => {
  return `Годовая отчетность ${stock.company.name} (${stock.ticker}) по МСФО — Скачать консолидированную отчетность в PDF | Инвестемика`;
}
