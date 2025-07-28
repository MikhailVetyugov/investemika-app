import { CompanySearch } from "@/components/company-search";
import { IncomeByYearTable } from "@/components/income-by-year-table";

export default function Home() {
  return (
    <div className="font-sans p-8">
      <div className="flex justify-center">
        <CompanySearch />
      </div>
      <div className="mt-[32px]">
        <IncomeByYearTable />
      </div>
    </div>
  );
}
