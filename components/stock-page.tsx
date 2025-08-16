'use client'
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { Coefficients } from "@/components//coefficients";
import { StockSearch } from "@/components/stock-search";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { Price } from "@/components/price";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IStock } from "@/types/stock";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import * as logoImage from '@/public/logo.png'

interface IStockPageProps {
  initialStock: IStock;
}

export const StockPage: React.FC<IStockPageProps> = ({ initialStock }) => {
  const [stock, setStock] = useState<IStock>(initialStock);

  const handleSelect = (stock: IStock) => {
    setStock(stock);
    // Не используем useRouter, чтобы это не привело к размонтированию страницы.
    window.history.pushState(null, "", `/${getUrlNameByStock(stock)}`);
  };

  const handlePopState = useCallback(() => {
    const urlName = window.location.pathname.slice(1);
    setStock(getStockByUrlName(urlName));
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="flex-[1_0_auto] flex flex-col overflow-hidden">
      <header className="h-auto p-4 flex flex-col items-center gap-2 bg-[#00446a] xl:h-[80px] xl:flex-row xl:p-0 xl:pr-8">
        <div className="flex-none">
          <Image src={logoImage} alt="Инвестемика" height={80} className="h-[80px] w-auto" />
        </div>
        <div className="w-full flex justify-center xl:w-auto">
          <StockSearch onSelect={handleSelect} />
        </div>
        <div className="text-white text-center xl:ml-auto xl:text-left">Сайт продолжает пополняться и дорабатываться</div>
      </header>
      <main className="max-w-[min(100%,1368px)] w-full mx-auto my-8 px-8 flex flex-col gap-4">
        <section className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">{stock.name} ({stock.ticker})</h1>
          <Price key={stock.ticker} stock={stock} />
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
