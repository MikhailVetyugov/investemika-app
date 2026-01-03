import { FileText, Flag } from "lucide-react";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { IDownloadFilesGroup } from "@/types/download";
import { DownloadFileRow } from "./download-file-row";
import { FilesCountBadge } from "./badges";

interface IFilesGroupCardProps {
  group: IDownloadFilesGroup;
}

export const FilesGroupCard: React.FC<IFilesGroupCardProps> = ({ group }) => {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <div className="flex items-center justify-between bg-gray-100 border-b p-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            {group.name}
          </CardTitle>
          {group.isPredecessor && (
            <CardDescription className="flex items-center gap-1 text-xs">
              <Flag className="h-3 w-3" />
              Отчетность компании-предшественника
            </CardDescription>
          )}
        </div>
        <FilesCountBadge group={group} />
      </div>

      <CardContent className="p-0">
        <div className="divide-y">
          {group.files.map((file, index) => <DownloadFileRow key={index} file={file} />)}
        </div>
      </CardContent>
    </Card>
  );
}
