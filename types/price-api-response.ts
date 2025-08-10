export interface IPriceApiResponse {
  securities: IDataSection;
  marketdata: IDataSection;
  dataversion: IDataSection;
  marketdata_yields: IDataSection;
}

interface IDataSection {
  metadata: IMetadata;
  columns: string[];
  data: Array<Array<any>>;
}

interface IMetadata {
  [key: string]: IMetadataField;
}

interface IMetadataField {
  type: string;
  bytes?: number;
  max_size?: number;
}
