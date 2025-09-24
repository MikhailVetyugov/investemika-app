'use client'
import { use } from "react";

import { Capitalization } from "@/components/capitalization";
import { Coefficients } from "@/components/coefficients";
import { DataContext } from "@/components/data-context";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { Price } from "@/components/price";
import { PriceChart } from "@/components/price-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IStock } from "@/types/stock";

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
          <IncomeByYearTable company={stock.company} />
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
    </>
  );
}
