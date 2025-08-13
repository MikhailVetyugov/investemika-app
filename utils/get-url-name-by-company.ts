import translitRusEng from "translit-rus-eng";

import { TCompany } from "@/types/company";

export const getUrlNameByCompany = (company: TCompany) => translitRusEng(company.name, { target: 'eng', slugify: true });
