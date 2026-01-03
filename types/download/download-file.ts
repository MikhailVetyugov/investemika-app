export interface IDownloadFile {
  name: string;
  year: number;
  language: 'ru' | 'en';
  type: 'annual_report' | 'press_release' | 'financial_statement';
  path: string;
}
