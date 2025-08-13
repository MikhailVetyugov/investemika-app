import translitRusEng from "translit-rus-eng";

import { ALL_COMPANIES } from "@/lib/data";

export const getCompanyByUrlName = (urlName: string) => {
  return ALL_COMPANIES.find(item => {
    const companyName = translitRusEng(item.name, { target: 'eng', slugify: true });

    return companyName.toLowerCase() === urlName.toLowerCase();
  }) ?? ALL_COMPANIES[0];
};
