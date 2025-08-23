import { PageShell } from "@/components/page-shell";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  const initialDataContext = { stock: null, marketData: { price: null, fullCapitalization: null } };

  return (
    <PageShell initialDataContext={initialDataContext}>
      <div className="grow-1 flex items-center justify-center">
        <LoaderCircle className="size-16 animate-spin origin-center text-investemika-primary" />
      </div>
    </PageShell>
  );
}
