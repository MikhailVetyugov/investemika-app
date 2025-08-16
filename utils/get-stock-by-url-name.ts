import translitRusEng from "translit-rus-eng";

import { ALL_STOCKS } from "@/lib/data";

export const getStockByUrlName = (urlName: string) => {
  return ALL_STOCKS.find(item => {
    const stockName = translitRusEng(item.name, { target: 'eng', slugify: true });

    return stockName.toLowerCase() === urlName.toLowerCase();
  }) ?? ALL_STOCKS[0];
};
