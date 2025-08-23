import { IStock } from "@/types/stock";

export const groupStocksByLetter = (stocks: IStock[]) => {
  const sortedStocks = stocks.sort((first, second) => {
    const nameA = first.company.name.toLowerCase();
    const nameB = second.company.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    
    return 1;
  });

  const groupedStocksByLetter: Record<string, IStock[]> = {};

  sortedStocks.forEach(stock => {
    const firstLetter = stock.company.name.charAt(0).toLowerCase();

    if (!groupedStocksByLetter[firstLetter]) {
      groupedStocksByLetter[firstLetter] = [];
    }

    groupedStocksByLetter[firstLetter].push(stock);
  });

  return groupedStocksByLetter;
}
