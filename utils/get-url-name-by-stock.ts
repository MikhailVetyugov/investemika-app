import translitRusEng from "translit-rus-eng";

import { IStock } from "@/types/stock";

export const getUrlNameByStock = (stock: IStock) => translitRusEng(stock.name, { target: 'eng', slugify: true });
