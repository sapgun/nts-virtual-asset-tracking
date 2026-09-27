import { notFound } from "next/navigation";
import { CasePlaybackPlayer } from "@/components/case-playback-player";
import { getCasePlayback } from "@/lib/case-playback-data";

export default async function CasePlaybackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playback = getCasePlayback(id);

  if (!playback) notFound();

  return <CasePlaybackPlayer playback={playback} />;
}
