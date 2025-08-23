'use client'
import { use } from "react";

import { Coefficients } from "@/components/coefficients";
import { DataContext } from "@/components/data-context";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { Price } from "@/components/price";
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
    </>
  );
}
