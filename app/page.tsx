import { CompanyPage } from "@/components/company-page";
import { ALL_COMPANIES } from "@/lib/data";

export default function Home() {
  return <CompanyPage initialCompany={ALL_COMPANIES[0]} />;
}
