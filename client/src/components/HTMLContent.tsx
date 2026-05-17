import type { CSSProperties } from "react";
import DOMPurify from "dompurify";

interface HTMLContentProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

export function HTMLContent({ content, className = "", style }: HTMLContentProps) {
  if (!content) return null;

  const hasHTMLTags = /<[^>]+>/.test(content);

  if (hasHTMLTags) {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p","br","strong","em","ul","ol","li","h1","h2","h3","h4","h5","h6","a","span","div","blockquote","hr","b","i","u","s","table","thead","tbody","tr","th","td"],
      ALLOWED_ATTR: ["href","target","rel","class"],
    });
    return (
      <div
        className={`prose prose-sm max-w-none ${className}`}
        style={style}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  } else {
    return <div className={`whitespace-pre-wrap ${className}`} style={style}>{content}</div>;
  }
}
