"use client";
import "@/components/text-editor/text-editor.css";

interface BlogContentProps {
    content: string;
    className?: string;
}

/**
 * Render HTML content từ Tiptap editor
 * Sử dụng blog-content.css cho DOL-style typography
 */
export default function BlogContent({ content, className }: BlogContentProps) {
    return (
        <article
            data-blog-content
            className={`news-editor-content text-justify ${className || ""}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
