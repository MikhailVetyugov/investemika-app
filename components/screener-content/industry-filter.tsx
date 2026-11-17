import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SCROLLBAR_CLASSES } from "@/constants/classes";
import { INDUSTRY_NAMES } from "@/constants/industries";
import { TIndustry } from "@/types/industry";

interface IIndustryFilterProps {
  id: string;
  /** Отрасли, которые можно выбрать, в порядке показа. */
  options: TIndustry[];
  selected: TIndustry[];
  onChange: (selected: TIndustry[]) => void;
}

const getTriggerText = (selected: TIndustry[]) => {
  if (selected.length === 0) return 'Все отрасли';
  if (selected.length === 1) return INDUSTRY_NAMES[selected[0]];

  return `Выбрано: ${selected.length}`;
};

export const IndustryFilter: React.FC<IIndustryFilterProps> = ({ id, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);

  const toggle = (industry: TIndustry) => {
    onChange(selected.includes(industry)
      ? selected.filter(item => item !== industry)
      : [...selected, industry]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal cursor-pointer"
        >
          <span className="truncate">{getTriggerText(selected)}</span>
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-(--radix-popover-trigger-width)">
        <Command>
          <CommandList className={`p-1 ${SCROLLBAR_CLASSES}`}>
            {options.map(industry => (
              <CommandItem
                key={industry}
                value={industry}
                className="cursor-pointer"
                onSelect={() => toggle(industry)}
              >
                <Check className={selected.includes(industry) ? 'opacity-100' : 'opacity-0'} />
                <span>{INDUSTRY_NAMES[industry]}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
