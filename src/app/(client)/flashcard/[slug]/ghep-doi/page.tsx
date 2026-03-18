"use client";

/**
 * Trang Match mode - Ghép đôi từ vựng
 */

import { use } from "react";
import { MatchPlayer } from "@/components/flashcard-study/match/match-player";

interface MatchPageProps {
  params: Promise<{ slug: string }>;
}

export default function MatchPage({ params }: MatchPageProps) {
  const { slug } = use(params);

  return <MatchPlayer deckId={slug} />;
}
