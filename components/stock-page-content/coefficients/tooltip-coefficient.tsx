import React from "react";
import { InfoIcon } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ITooltipCoefficientProps {
  text: string;
  tooltipAriaLabel: string;
  tooltipContent: React.ReactNode;
}

export const TooltipCoefficient: React.FC<ITooltipCoefficientProps> = ({ text, tooltipAriaLabel, tooltipContent }) => {
  return (
    <span className="flex items-center justify-end gap-2">
      <span>{text}</span>
      <Popover>
        <PopoverTrigger aria-label={tooltipAriaLabel}>
          <InfoIcon className="size-4 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent className="text-xs text-gray-500">
          {tooltipContent}
        </PopoverContent>
      </Popover>
    </span>
  );
}
