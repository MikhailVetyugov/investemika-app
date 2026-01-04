'use client'
import { use } from "react";

import { DataContext } from "@/components/data-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IStock } from "@/types/stock";
import { DESCRIPTIONS, SEO_DESCRIPTION } from "@/lib/descriptions";
import { Coefficients } from "./coefficients";

import { Capitalization } from "./capitalization";
import { DownloadPageButton } from "./download-page-button";
import { IncomeByYearTable } from "./income-by-year-table";
import { Price } from "./price";
import { PriceChart } from "./price-chart";

export const StockPageContent: React.FC = () => {
  const data = use(DataContext);
  const stock = data.stock as IStock;

  return (
    <>
      <section className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">{stock.name} ({stock.ticker})</h1>
        <Price stock={stock} />
        <Capitalization stock={stock} />
      </section>
      <Tabs defaultValue="tables">
        <TabsList>
          <TabsTrigger value="tables" className="cursor-pointer">Отчетность и коэффициенты</TabsTrigger>
          <TabsTrigger value="chart" className="cursor-pointer">График</TabsTrigger>
        </TabsList>
        <TabsContent value="tables" className="flex flex-col gap-4">
          <section className="-mx-8 lg:mx-0">
            <IncomeByYearTable
              company={stock.company}
              downloadPageButton={<DownloadPageButton stock={stock} className="ml-8 lg:ml-0" />}
            />
          </section>
          <section>
            <Coefficients stock={stock} />
          </section>
        </TabsContent>
        <TabsContent value="chart">
          <section className="mt-2 -mx-6 md:mx-0">
            <PriceChart ticker={stock.ticker} />
          </section>
        </TabsContent>
      </Tabs>
      <section>
        <h2 className="my-2 font-bold text-xl">О компании</h2>
        <p>{DESCRIPTIONS[stock.ticker]}</p>
        <p>{SEO_DESCRIPTION}</p>
      </section>
    </>
  );
}
