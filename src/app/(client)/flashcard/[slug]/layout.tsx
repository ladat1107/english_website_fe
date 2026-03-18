/**
 * Layout cho trang study flashcard [slug]
 * Trang overview giữ ClientLayout, nhưng sub-routes (hoc, luyen-tap...) sẽ override
 */

import type { ReactNode } from "react";

export default function FlashcardStudyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
