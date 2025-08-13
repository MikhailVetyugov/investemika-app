import { CompanyPage } from "@/components/company-page";
import { getCompanyByUrlName } from '@/utils/get-company-by-url-name';

export default async function Company({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;

  return <CompanyPage initialCompany={getCompanyByUrlName(company)} />;
}
