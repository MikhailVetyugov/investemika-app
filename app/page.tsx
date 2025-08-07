'use client'
import { useState } from "react";

import { CompanySearch } from "@/components/company-search";
import { IncomeByYearTable } from "@/components/income-by-year-table";
import { ALL_COMPANIES } from "@/lib/data";
import { TCompany } from "@/types/company";

export default function Home() {
  const [company, setCompany] = useState<TCompany>(ALL_COMPANIES[0]);

  const handleSelect = (company: TCompany) => setCompany(company);

  return (
    <div className="font-sans p-8">
      <div className="flex justify-center">
        <CompanySearch onSelect={handleSelect} />
      </div>
      <div className="mt-[32px]">
        <IncomeByYearTable company={company} />
      </div>
    </div>
  );
}
