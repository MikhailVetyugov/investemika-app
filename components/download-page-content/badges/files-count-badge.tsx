import { Badge } from "@/components/ui/badge";
import { IDownloadFilesGroup } from "@/types/download";

interface IFilesCountBadgeProps {
  group: IDownloadFilesGroup;
}

export const FilesCountBadge: React.FC<IFilesCountBadgeProps> = ({ group }) => {
  return (
    <Badge variant="outline" className="text-xs">
      {group.files.length} {group.files.length === 1 ? 'файл' : 'файла'}
    </Badge>
  );
}
