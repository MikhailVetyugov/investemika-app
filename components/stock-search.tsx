import React, { useRef, useState } from "react";

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
import { SCROLLBAR_CLASSES } from "@/constants/classes"
import { ALL_STOCKS } from "@/lib/data";
import { IStock } from "@/types/stock";

interface IStockSearchProps {
  onSelect: (stock: IStock) => void;
}

export const StockSearch: React.FC<IStockSearchProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState<string>('');
  const [options, setOptions] = useState<IStock[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const notFound = text.length > 0 && options.length === 0;

  const handleValueChange = (value: string) => {
    const searchText = value.trim().toLowerCase();
    const foundStocks = ALL_STOCKS.filter(stock => stock.name.toLowerCase().indexOf(searchText) > -1);

    setOptions(foundStocks);
    setText(value);
    setOpen(true);
  };

  const handleValueClear = () => {
    setText('');
    setOptions(ALL_STOCKS);
    setOpen(true);

    inputRef.current?.focus();
  }

  const handleFocus = () => {
    if (text === '') {
      setOptions(ALL_STOCKS);
      setOpen(true);
    }
  };

  const handleInteractOutside = (event: Event) => {
    if (event.target === inputRef.current) {
      event.preventDefault();
    }
  }

  const handleSelect = (ticker: string) => {
    const stock = ALL_STOCKS.find(stock => stock.ticker === ticker)!;

    setText('')
    setOpen(false);

    onSelect(stock);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md md:min-w-[450px] max-w-[900px]" shouldFilter={false}>
        <PopoverAnchor>
          <CommandInput
            ref={inputRef}
            className="text-base lg:text-sm"
            placeholder="Введите имя компании..."
            value={text}
            onValueChange={handleValueChange}
            onClearIconClick={handleValueClear}
            onFocus={handleFocus}
          />
        </PopoverAnchor>
        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width)"
          onOpenAutoFocus={event => event.preventDefault()}
          onInteractOutside={handleInteractOutside}
        >
          <CommandList className={SCROLLBAR_CLASSES}>
            {notFound && <CommandEmpty>Компания не нашлась</CommandEmpty>}
            {options.map(option => (
              <CommandItem key={option.ticker} value={option.ticker} className="cursor-pointer" onSelect={handleSelect}>
                <span>{option.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
};
