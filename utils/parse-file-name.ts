import { IDownloadFile } from "@/types/download";

const YEAR_RE = /^\d{4}$/;

export const parseFileName = (filename: string): Partial<IDownloadFile | null> => {
  const withoutExt = filename.replace('.pdf', '');
  const parts = withoutExt.split('-');
  
  let year;
  let language: 'ru' | 'en';
  let type: 'annual_report' | 'press_release' | 'financial_statement';
  
  if (YEAR_RE.test(parts[0])) {
    year = Number(parts[0]);
  } else {
    return null;
  }

  const languagePart = parts[1];
  language = languagePart === 'en' ? 'en' : 'ru';

  const typePart = languagePart === 'en' ? parts[2] : parts[1];

  if (typePart === 'annual_report') {
    type = 'annual_report';
  } else if (typePart === 'press_release') {
    type = 'press_release';
  } else {
    type = 'financial_statement';
  }
  
  return { name: filename, year, language, type };
};
