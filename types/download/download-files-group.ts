import { IDownloadFile } from "./download-file";

export interface IDownloadFilesGroup {
  name: string;
  files: IDownloadFile[];
  isPredecessor?: boolean;
}
