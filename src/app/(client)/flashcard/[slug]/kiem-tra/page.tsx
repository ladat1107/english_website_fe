"use client";

/**
 * Trang Test mode - Kiểm tra kiến thức
 */

import { use } from "react";
import { TestPlayer } from "@/components/flashcard-study/test/test-player";

interface TestPageProps {
  params: Promise<{ slug: string }>;
}

export default function TestPage({ params }: TestPageProps) {
  const { slug } = use(params);

  return <TestPlayer deckId={slug} />;
}
