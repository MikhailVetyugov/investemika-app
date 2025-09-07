'use client'
import Image from "next/image";
import Link from "next/link";

import { DataContext } from "@/components/data-context";
import { StockSearch } from "@/components/stock-search";
import { useDataContext } from "@/hooks/use-data-context";
import { useStockSelection } from "@/hooks/use-stock-selection";
import { TInitialDataContext } from "@/types/data-context";
import * as logoImage from '@/public/logo.png'

interface IPageShellProps {
  initialDataContext: TInitialDataContext;
  children: React.ReactNode | React.ReactNode[];
  stockPage?: boolean;
}

const PageShellComponent: React.FC<Omit<IPageShellProps, 'initialDataContext'>> = ({ children, stockPage = false }) => {
  const { stockSelectionHandler } = useStockSelection(stockPage);

  return (
    <div className="flex-[1_0_auto] flex flex-col overflow-hidden">
      <header className="h-auto p-4 flex flex-col items-center gap-2 bg-investemika-primary xl:h-[80px] xl:flex-row xl:p-0 xl:pr-8">
        <div className="flex-none">
          <Link href="/">
            <Image src={logoImage} alt="Инвестемика" height={80} className="h-[80px] w-auto" />
          </Link>
        </div>
        <div className="w-full flex justify-center xl:w-auto">
          <StockSearch onSelect={stockSelectionHandler} />
        </div>
      </header>
      <main className="max-w-[min(100%,1368px)] w-full grow-1 mx-auto my-8 px-8 flex flex-col gap-4">
        {children}
      </main>
      <footer className="mt-auto px-4 flex items-center justify-center bg-investemika-primary text-white xl:h-[40px] xl:justify-start">
        © {new Date().getFullYear()}. Investemika.ru
      </footer>
    </div>
  );
}

export const PageShell: React.FC<IPageShellProps> = ({ initialDataContext, ...restProps }) => {
  const dataContext = useDataContext(initialDataContext);

  return (
    <DataContext.Provider value={dataContext}>
      <PageShellComponent {...restProps} />
    </DataContext.Provider>
  );
}
