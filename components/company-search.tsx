import React, { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"
import { ALL_COMPANIES } from "@/lib/data";
import { TCompany } from "@/types/company";

interface ICompanySearchProps {
  onSelect: (company: TCompany) => void;
}

export const CompanySearch: React.FC<ICompanySearchProps> = ({ onSelect }) => {
  const [open, setOpen] = React.useState(false)
  const [text, setText] = useState<string>('');
  const [companyOptions, setCompanyOptions] = useState<TCompany[]>([]);

  const notFound = text.length > 0 && companyOptions.length === 0;

  const handleValueChange = (value: string) => {
    const searchText = value.trim().toLowerCase();
    const foundCompanies = ALL_COMPANIES.filter(company => company.name.toLowerCase().indexOf(searchText) > -1);

    setCompanyOptions(foundCompanies);
    setText(value);
    setOpen(true);
  };

  const handleFocus = () => {
    if (text === '') {
      setCompanyOptions(ALL_COMPANIES);
      setOpen(true);
    }
  };

  const handleSelect = (value: string) => {
    const company = ALL_COMPANIES.find(company => company.id === Number(value))!;

    setText(company.name)
    setOpen(false);

    onSelect(company);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] max-w-[900px]" shouldFilter={false}>
        <PopoverAnchor>
          <CommandInput placeholder="Введите имя компании..." value={text} onValueChange={handleValueChange} onFocus={handleFocus} />
        </PopoverAnchor>
        <PopoverContent className="p-0 w-(--radix-popover-trigger-width)" onOpenAutoFocus={event => event.preventDefault()}>
          <CommandList>
            {notFound && <CommandEmpty>Компания не нашлась</CommandEmpty>}
            {companyOptions.map(companyOption => (
              <CommandItem key={companyOption.id} value={String(companyOption.id)} className="cursor-pointer" onSelect={handleSelect}>
                <span>{companyOption.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
};
