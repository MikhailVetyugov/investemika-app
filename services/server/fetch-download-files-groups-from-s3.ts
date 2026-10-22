import { YANDEX_DISK_DIR } from '@/constants/yandex-disk';
import { IDownloadFile, IDownloadFilesGroup } from "@/types/download";
import { parseFileName } from "@/utils/parse-file-name";
import { listS3Objects } from './s3';

/**
 * Retrieves files groups from S3 to display on Download page.
 */
export async function fetchDownloadFilesGroupsFromS3(stockUrlName: string): Promise<IDownloadFilesGroup[]> {
  try {
    const list = await listS3Objects(`investemika/${stockUrlName}`);

    if (!list?.Contents) {
      return [];
    }

    const files = list.Contents.filter(item => item.Size); // files only, not directories.
    const groups: IDownloadFilesGroup[] = [];

    const rootFileNames = []; // Main group (files in company folder root).
    const subfolders = new Map();

    for (const item of files) {
      if (item.Key) {
        const parts = item.Key.split('/');

        const filename = parts[parts.length - 1];
        // parts example: ['investemika', 'polyus', '2025.pdf']
        const isRootFile = parts[2] === filename;

        if (isRootFile) {
          rootFileNames.push(filename);
        } else {
          // parts example: ['investemika', 't_tehnologii', 'TCS Group Holding PLC', '2025.pdf']
          const subfolder = parts[2];

          if (subfolders.has(subfolder)) {
            const subfolderFilenames = subfolders.get(subfolder);
            subfolders.set(subfolder, [...subfolderFilenames, filename]);
          } else {
            subfolders.set(subfolder, [filename]);
          }
        }
      }
    }

    const rootFiles = rootFileNames
      .map((filename: string) => parseFileName(filename))
      // TODO: Add types.
      .filter((parsed: any) => parsed != null)
      .map((parsed: any) => {
        return {
          ...parsed,
          path: `${stockUrlName}/${parsed.name}`,
        } as IDownloadFile;
      });

    if (rootFiles.length > 0) {
      groups.push({
        name: 'Основная отчетность',
        files: rootFiles.sort((a: any, b: any) => b.year - a.year)
      });
    }

    // Subfolders (companies-predecessors).
    for (const subfolderEntry of subfolders) {
      const [subfolderName, filenames] = subfolderEntry;

      const subfolderFiles = filenames
        .map((filename: any) => parseFileName(filename))
        .filter((parsed: any) => parsed != null)
        .map((parsed: any) => {
          return {
            ...parsed,
            path: `${stockUrlName}/${subfolderName}/${parsed.name}`,
          } as IDownloadFile;
        });

      if (subfolderFiles.length > 0) {
        groups.push({
          name: subfolderName,
          files: subfolderFiles.sort((a: any, b: any) => b.year - a.year),
          isPredecessor: true,
        });
      }
    }

    return groups;
  } catch (error) {
    console.error(`Error reading download files groups for ${stockUrlName}:`, error);

    return [];
  }
}
