import { FileType } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const PDFBadge: React.FC = () => {
  return (
    <Badge variant="outline" className="flex items-center">
      <FileType className="h-4 w-4" />
      PDF
    </Badge>
  );
}
