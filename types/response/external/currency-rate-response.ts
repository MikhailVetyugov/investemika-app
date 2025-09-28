export interface ICurrencyRateResponse {
  Date: string;
  PreviousDate: string;
  PreviousURL: string;
  Timestamp: string;
  Valute: Record<string, {
    ID: string;
      NumCode: string;
      CharCode: string;
      Nominal: number;
      Name: string;
      Value: number;
      Previous: number;
  }>;
}
