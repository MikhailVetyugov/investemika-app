import { Globe } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IDownloadFile } from "@/types/download";

interface ILanguageBadgeProps {
  language: IDownloadFile['language'];
}

export const LanguageBadge: React.FC<ILanguageBadgeProps> = ({ language }) => {
  return (
    <Badge
      variant={language === 'en' ? 'default' : 'secondary'}
      className="flex items-center"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'English' : 'Русский'}
    </Badge>
  );
}
