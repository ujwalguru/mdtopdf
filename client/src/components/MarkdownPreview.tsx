import { useMemo } from 'react';
import MarkdownIt from 'markdown-it';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

/**
 * Live preview component that renders Markdown to HTML
 * Uses markdown-it library with HTML and linkify enabled
 */
function MarkdownPreview({ markdown, className = "" }: MarkdownPreviewProps) {
  // Initialize markdown-it with HTML and linkify enabled
  const md = useMemo(() => {
    return new MarkdownIt({
      html: true,        // Enable HTML tags in source
      linkify: true,     // Autoconvert URL-like text to links
      typographer: true, // Enable smart quotes and other typography
    });
  }, []);

  // Render markdown to HTML
  const htmlContent = useMemo(() => {
    if (!markdown.trim()) {
      return '<p class="text-muted-foreground">Preview will appear here...</p>';
    }
    return md.render(markdown);
  }, [markdown, md]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-medium text-foreground">Live Preview</h2>
      </div>
      <div className="flex-1 overflow-auto bg-card">
        <div 
          className={`
            p-6 prose prose-gray dark:prose-invert max-w-none
            prose-headings:text-card-foreground
            prose-p:text-card-foreground 
            prose-strong:text-card-foreground
            prose-code:text-card-foreground
            prose-pre:bg-muted prose-pre:text-muted-foreground
            prose-blockquote:text-card-foreground prose-blockquote:border-l-primary
            prose-a:text-primary hover:prose-a:text-primary/80
            ${className}
          `}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          data-testid="content-markdown-preview"
        />
      </div>
    </div>
  );
}

export default MarkdownPreview;