import fs from "fs";
import path from "path";

import { IDownloadFile, IDownloadFilesGroup } from "@/types/download";
import { parseFileName } from "@/utils/parse-file-name";

export async function fetchDownloadFilesGroups(stockUrlName: string): Promise<IDownloadFilesGroup[]> {
  try {
    const filesDir = path.join(process.cwd(), 'data', stockUrlName);
    
    if (!fs.existsSync(filesDir)) {
      return [];
    }
    
    const items = fs.readdirSync(filesDir, { withFileTypes: true });
    const groups: IDownloadFilesGroup[] = [];
    
    // Основная группа
    const rootFiles = items
      .filter(item => item.isFile() && item.name.endsWith('.pdf'))
      .map(item => parseFileName(item.name))
      .filter(parsed => parsed != null)
      .map(parsed => {
        return {
          ...parsed,
          path: `${stockUrlName}/${parsed.name}`,
        } as IDownloadFile;
      });
    
    if (rootFiles.length > 0) {
      groups.push({
        name: 'Основная отчетность',
        files: rootFiles.sort((a, b) => b.year - a.year)
      });
    }
    
    // Подпапки (компании-предшественники)
    const subfolders = items.filter(item => item.isDirectory());
    
    for (const subfolder of subfolders) {
      const subfolderPath = path.join(filesDir, subfolder.name);
      const subfolderFiles = fs.readdirSync(subfolderPath)
        .filter(file => file.endsWith('.pdf'))
        .map(filename => parseFileName(filename))
        .filter(parsed => parsed != null)
        .map(parsed => {
          return {
            ...parsed,
            path: `${stockUrlName}/${subfolder.name}/${parsed.name}`,
          } as IDownloadFile;
        });
      
      if (subfolderFiles.length > 0) {
        groups.push({
          name: subfolder.name,
          files: subfolderFiles.sort((a, b) => b.year - a.year),
          isPredecessor: true,
        });
      }
    }
    
    return groups;
  } catch (error) {
    console.error(`Error reading reports for ${stockUrlName}:`, error);

    return [];
  }
}
