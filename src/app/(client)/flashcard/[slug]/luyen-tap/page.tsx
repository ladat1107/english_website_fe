"use client";

/**
 * Trang Learn mode - Học thích ứng với MC + written
 */

import { use } from "react";
import { LearnPlayer } from "@/components/flashcard-study/learn/learn-player";

interface LearnPageProps {
  params: Promise<{ slug: string }>;
}

export default function LearnPage({ params }: LearnPageProps) {
  const { slug } = use(params);

  return <LearnPlayer deckId={slug} />;
}
