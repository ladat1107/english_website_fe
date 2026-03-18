"use client";

/**
 * Trang Flip mode - Học flashcard bằng cách lật thẻ
 * Full-screen immersive, không header/footer
 */

import { use } from "react";
import { FlipPlayer } from "@/components/flashcard-study/flip/flip-player";

interface FlipPageProps {
  params: Promise<{ slug: string }>;
}

export default function FlipPage({ params }: FlipPageProps) {
  const { slug } = use(params);

  return <FlipPlayer deckId={slug} />;
}
