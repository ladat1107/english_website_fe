/**
 * Trang chi tiết bộ flashcard
 * Server component - Fetch metadata cho SEO, render client component
 */

import type { Metadata } from "next";
import { SITE_CONFIG } from "@/utils/constants";
import { DeckOverview } from "@/components/flashcard-study/overview/deck-overview";
import { http } from "@/lib/http";

interface FlashcardDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Fetch data cho metadata (server-side, không cần auth) */
async function fetchDeckPublic(id: string) {
  try {
    const res = await http.get(`/flash-card-deck/public/${id}`);
    if (!res.success) return null;
    return res.data;
  } catch (error) {
    console.error("Error fetching deck for metadata", error);
    return null;
  }
}

/** SEO metadata động */
export async function generateMetadata({
  params,
}: FlashcardDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = await fetchDeckPublic(slug);

  if (!deck) {
    return {
      title: `Flashcard | ${SITE_CONFIG.name}`,
    };
  }

  const title = `${deck.title} - Flashcard | ${SITE_CONFIG.name}`;
  const description =
    deck.description ||
    `Học ${deck.flashcardsCount} từ vựng với flashcard "${deck.title}" trên ${SITE_CONFIG.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: deck.image ? [deck.image] : [],
      type: "website",
    },
  };
}

export default async function FlashcardDetailPage({
  params,
}: FlashcardDetailPageProps) {
  const { slug } = await params;

  return <DeckOverview deckId={slug} />;
}
