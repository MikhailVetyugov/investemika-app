import { IDownloadFile } from "@/types/download";

export function formatReportType(type: IDownloadFile['type']) {
  switch (type) {
    case 'annual_report': return 'Годовой отчёт';
    case 'press_release': return 'Пресс-релиз';
    case 'financial_statement': return 'Финансовая отчётность';
    default: return 'Отчёт';
  }
}
