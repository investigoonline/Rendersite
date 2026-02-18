import type { CSSProperties } from "react";

interface HTMLContentProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

export function HTMLContent({ content, className = "", style }: HTMLContentProps) {
  if (!content) return null;

  const hasHTMLTags = /<[^>]+>/.test(content);

  if (hasHTMLTags) {
    return (
      <div
        className={`prose prose-sm max-w-none ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  } else {
    return <div className={`whitespace-pre-wrap ${className}`} style={style}>{content}</div>;
  }
}
