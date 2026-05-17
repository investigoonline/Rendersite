import { useRef, useEffect } from "react";
import type { CSSProperties } from "react";
import DOMPurify from "dompurify";

interface HTMLContentProps {
  content: string;
  className?: string;
  style?: CSSProperties;
}

const ALLOWED_TAGS = ["p","br","strong","em","ul","ol","li","h1","h2","h3","h4","h5","h6","a","span","div","blockquote","hr","b","i","u","s","table","thead","tbody","tr","th","td"] as const;
const ALLOWED_ATTR = ["href","target","rel","class"] as const;

export function HTMLContent({ content, className = "", style }: HTMLContentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = divRef.current;
    if (!el || !content) return;

    const fragment = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [...ALLOWED_TAGS],
      ALLOWED_ATTR: [...ALLOWED_ATTR],
      RETURN_DOM_FRAGMENT: true,
      RETURN_DOM_IMPORT: true,
    }) as DocumentFragment;

    el.replaceChildren(fragment);
  }, [content]);

  if (!content) return null;

  const hasHTMLTags = /<[^>]+>/.test(content);
  if (!hasHTMLTags) {
    return <div className={`whitespace-pre-wrap ${className}`} style={style}>{content}</div>;
  }

  return (
    <div
      ref={divRef}
      className={`prose prose-sm max-w-none ${className}`}
      style={style}
    />
  );
}
