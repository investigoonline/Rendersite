interface HTMLContentProps {
  content: string;
  className?: string;
}

/**
 * Renders content that may be either plain text or HTML from rich text editor
 * - If content contains HTML tags, renders as HTML
 * - If content is plain text, preserves line breaks with whitespace-pre-wrap
 */
export function HTMLContent({ content, className = '' }: HTMLContentProps) {
  if (!content) return null;
  
  // Check if content contains HTML tags (simple heuristic)
  const hasHTMLTags = /<[^>]+>/.test(content);
  
  if (hasHTMLTags) {
    // Render as HTML (rich text editor output)
    // Remove prose class to preserve editor's text alignment and formatting
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  } else {
    // Render as plain text with line break preservation
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {content}
      </div>
    );
  }
}
