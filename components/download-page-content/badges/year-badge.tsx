import { Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface IYearBadgeProps {
  year: number;
}

export const YearBadge: React.FC<IYearBadgeProps> = ({ year }) => {
  return (
    <Badge variant="outline" className="flex items-center">
      <Calendar className="h-4 w-4" />
      {year}
    </Badge>
  );
}
