import { InvestigationWorkbench } from "@/components/investigation-workbench";

export default async function InvestigationsPage({
  searchParams,
}: {
  searchParams: Promise<{ import?: string }>;
}) {
  const params = await searchParams;

  return (
    <InvestigationWorkbench importedMode={params.import === "public"} />
  );
}
