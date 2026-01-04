import { YANDEX_DISK_DIR } from "@/constants/yandex-disk";

export async function fetchYandexDiskFileDownloadUrl(filePath: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      public_key: YANDEX_DISK_DIR,
      path: `/${filePath}`
    });

    const response = await fetch(`https://cloud-api.yandex.net/v1/disk/public/resources/download?${params}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.href || null;
    
  } catch (error) {
    console.error('Error getting yandex disk file download URL:', error);

    return null;
  }
}
