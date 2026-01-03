import translitRusEng from "translit-rus-eng";

import { ALL_STOCKS } from "@/lib/data";
import { IStock } from "@/types/stock";

export const getStockByUrlName = (urlName: string): IStock | null => {
  return ALL_STOCKS.find(item => {
    const stockName = translitRusEng(item.name, { target: 'eng', slugify: true });

    return stockName.toLowerCase() === urlName.toLowerCase();
  }) ?? null;
};
