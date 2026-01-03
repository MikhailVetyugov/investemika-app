import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IDownloadFile } from "@/types/download";
import { formatReportType } from "./utils";

interface ITypeBadgeProps {
  type: IDownloadFile['type'];
}

export const TypeBadge: React.FC<ITypeBadgeProps> = ({ type }) => {  
  const variantMap = {
    annual_report: 'default',
    press_release: 'default',
    financial_statement: 'outline'
  } as const;
  
  return (
    <Badge variant={variantMap[type]}>
      <FileText className="h-4 w-4" />
      {formatReportType(type)}
    </Badge>
  );
}
