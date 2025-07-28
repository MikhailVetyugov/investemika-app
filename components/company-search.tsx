'use client'
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

const ALL_COMPANIES = ['Лукойл', 'Газпром', 'Норникель', 'Новатэк', 'Полюс', 'Роснефть', 'Сбербанк', 'Татнефть', 'Транснефть', 'Северсталь'];

export function CompanySearch() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = useState<string>('');
  const [companies, setCompanies] = useState<string[]>([]);

  const notFound = value.length > 0 && companies.length === 0;

  const handleValueChange = (value: string) => {
    const searchText = value.trim().toLowerCase();
    const foundCompanies = ALL_COMPANIES.filter(company => company.toLowerCase().indexOf(searchText) > -1);
    setCompanies(foundCompanies);
    setValue(value);
    setOpen(true);
  };

  const handleFocus = () => {
    if (value === '') {
      setCompanies(ALL_COMPANIES);
      setOpen(true);
    }
  };

  const handleSelect = (value: string) => {
    setValue(value)
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] max-w-[900px]" shouldFilter={false}>
        <PopoverAnchor>
          <CommandInput placeholder="Введите имя компании..." value={value} onValueChange={handleValueChange} onFocus={handleFocus} />
        </PopoverAnchor>
        <PopoverContent className="p-0 w-(--radix-popover-trigger-width)" onOpenAutoFocus={event => event.preventDefault()}>
          <CommandList>
            {notFound && <CommandEmpty>Компания не нашлась</CommandEmpty>}
            {companies.map(company => (
              <CommandItem key={Math.random()} className="cursor-pointer" onSelect={handleSelect}>
                <span>{company}</span>
              </CommandItem>
            ))}
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
}
