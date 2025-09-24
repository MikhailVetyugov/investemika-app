export interface IChartDataExternalResponse {
  candles: IDataSection;
}

interface IDataSection {
  metadata: IMetadata;
  columns: string[];
  data: Array<Array<string | number>>;
}

interface IMetadata {
  [key: string]: IMetadataField;
}

interface IMetadataField {
  type: string;
  bytes?: number;
  max_size?: number;
}
