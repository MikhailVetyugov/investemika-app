'use client'
import Image from "next/image";

import { Coefficients } from "@/components//coefficients";
import { DataContext } from "@/components/data-context";
import { StockSearch } from "@/components/stock-search";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { Price } from "@/components/price";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDataContext } from "@/hooks/use-data-context";
import { useStockSelection } from "@/hooks/use-stock-selection";
import { IStock } from "@/types/stock";
import { TInitialDataContext } from "@/types/data-context";
import * as logoImage from '@/public/logo.png'

interface IStockPageProps {
  initialStock: IStock;
  initialDataContext: TInitialDataContext;
}

const StockPageContent: React.FC<Omit<IStockPageProps, 'initialDataContext'>> = ({ initialStock }) => {
  const [stock, stockSelectionHandler] = useStockSelection(initialStock);

  return (
    <div className="flex-[1_0_auto] flex flex-col overflow-hidden">
      <header className="h-auto p-4 flex flex-col items-center gap-2 bg-[#00446a] xl:h-[80px] xl:flex-row xl:p-0 xl:pr-8">
        <div className="flex-none">
          <Image src={logoImage} alt="Инвестемика" height={80} className="h-[80px] w-auto" />
        </div>
        <div className="w-full flex justify-center xl:w-auto">
          <StockSearch onSelect={stockSelectionHandler} />
        </div>
        <div className="text-white text-center xl:ml-auto xl:text-left">Сайт продолжает пополняться</div>
      </header>
      <main className="max-w-[min(100%,1368px)] w-full mx-auto my-8 px-8 flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">{stock.name} ({stock.ticker})</h1>
          <Price stock={stock} />
        </section>
        <section>
          <Tabs defaultValue="financialStatements">
            <TabsList>
              <TabsTrigger value="financialStatements" className="cursor-pointer">Финансовая отчетность</TabsTrigger>
              <TabsTrigger value="coefficients" className="cursor-pointer">Коэффициенты</TabsTrigger>
            </TabsList>
            <TabsContent value="financialStatements">
              <IncomeByYearTable company={stock.company} />
            </TabsContent>
            <TabsContent value="coefficients">
              <Coefficients stock={stock} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className="mt-auto px-4 flex items-center justify-center bg-[#00446a] text-white xl:h-[40px] xl:justify-start">
        © {new Date().getFullYear()}. Investemika.ru
      </footer>
    </div>
  );
}

export const StockPage: React.FC<IStockPageProps> = ({ initialDataContext, ...restProps }) => {
  const dataContext = useDataContext(initialDataContext);

  return (
    <DataContext.Provider value={dataContext}>
      <StockPageContent {...restProps} />
    </DataContext.Provider>
  );
}
