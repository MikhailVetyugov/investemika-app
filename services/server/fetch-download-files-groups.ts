import { YANDEX_DISK_DIR } from '@/constants/yandex-disk';
import { IDownloadFile, IDownloadFilesGroup } from "@/types/download";
import { parseFileName } from "@/utils/parse-file-name";

export async function fetchDownloadFilesGroups(stockUrlName: string): Promise<IDownloadFilesGroup[]> {
  try {
    const apiUrl = 'https://cloud-api.yandex.net/v1/disk/public/resources';
    const params = new URLSearchParams({
      public_key: YANDEX_DISK_DIR,
      path: `/${stockUrlName}`,
      limit: "1000"
    });

    const response = await fetch(`${apiUrl}?${params}`);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!data._embedded?.items) {
      return [];
    }

    const items = data._embedded.items;
    const groups: IDownloadFilesGroup[] = [];

    // Основная группа (файлы в корне папки)
    const rootFiles = items
      // TODO: Добавить типизацию.
      .filter((item: any) => item.type === 'file' && item.name.endsWith('.pdf'))
      .map((item: any) => parseFileName(item.name))
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

    // Подпапки (компании-предшественники)
    const subfolders = items.filter((item: any) => item.type === 'dir');

    for (const subfolder of subfolders) {
      const subfolderResponse = await fetch(
        `${apiUrl}?${new URLSearchParams({
          public_key: YANDEX_DISK_DIR,
          path: `/${stockUrlName}/${subfolder.name}`,
          limit: "1000"
        })}`
      );

      if (!subfolderResponse.ok) continue;

      const subfolderData = await subfolderResponse.json();

      if (!subfolderData._embedded?.items) continue;

      const subfolderFiles = subfolderData._embedded.items
        .filter((item: any) => item.type === 'file' && item.name.endsWith('.pdf'))
        .map((item: any) => parseFileName(item.name))
        .filter((parsed: any) => parsed != null)
        .map((parsed: any) => {
          return {
            ...parsed,
            path: `${stockUrlName}/${subfolder.name}/${parsed.name}`,
          } as IDownloadFile;
        });

      if (subfolderFiles.length > 0) {
        groups.push({
          name: subfolder.name,
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
