import { useMemo, useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { Eye, Sparkles, FileText } from 'lucide-react';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

/**
 * Enhanced Live preview component with smooth animations and better styling
 * Features: Content fade transitions, word count in header, loading states
 */
function MarkdownPreview({ markdown, className = "" }: MarkdownPreviewProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  // Initialize markdown-it with security hardening
  const md = useMemo(() => {
    const markdownIt = new MarkdownIt({
      html: false,       // Disable raw HTML for security
      linkify: true,     // Autoconvert URL-like text to links
      typographer: true, // Enable smart quotes and other typography
      breaks: true,      // Convert line breaks to <br>
    });
    
    // Override default link rendering to add security attributes
    const defaultRender = markdownIt.renderer.rules.link_open || function(tokens, idx, options, env, renderer) {
      return renderer.renderToken(tokens, idx, options);
    };
    
    markdownIt.renderer.rules.link_open = function (tokens, idx, options, env, renderer) {
      const aIndex = tokens[idx].attrIndex('target');
      const relIndex = tokens[idx].attrIndex('rel');
      
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']); // Add target="_blank"
      } else {
        tokens[idx].attrs![aIndex][1] = '_blank';
      }
      
      if (relIndex < 0) {
        tokens[idx].attrPush(['rel', 'noopener noreferrer']); // Add security attributes
      } else {
        tokens[idx].attrs![relIndex][1] = 'noopener noreferrer';
      }
      
      return defaultRender(tokens, idx, options, env, renderer);
    };
    
    return markdownIt;
  }, []);

  // Show updating indicator when markdown changes
  useEffect(() => {
    if (markdown.trim()) {
      setIsUpdating(true);
      const timeout = setTimeout(() => {
        setIsUpdating(false);
        setContentKey(prev => prev + 1);
      }, 200);
      
      return () => clearTimeout(timeout);
    }
  }, [markdown]);

  // Render markdown to HTML with sanitization for security
  const htmlContent = useMemo(() => {
    if (!markdown.trim()) {
      // Safe static HTML for empty state
      return `
        <div class="flex flex-col items-center justify-center h-64 text-center animate-in fade-in duration-500">
          <div class="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-muted-foreground mb-2">Preview will appear here</h3>
          <p class="text-sm text-muted-foreground max-w-sm">Start typing in the editor to see your markdown rendered in real-time with beautiful formatting.</p>
        </div>
      `;
    }
    
    // Render markdown and sanitize the output to prevent XSS
    const rendered = md.render(markdown);
    return DOMPurify.sanitize(rendered, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'del',
        'a', 'ul', 'ol', 'li', 'blockquote',
        'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'img', 'div', 'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'alt', 'title', 'class'],
      FORBID_CONTENTS: ['script', 'style'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
      ADD_ATTR: ['target', 'rel']
    });
  }, [markdown, md]);

  const wordCount = useMemo(() => {
    if (!markdown.trim()) return 0;
    return markdown.trim().split(/\s+/).length;
  }, [markdown]);

  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right duration-300">
      {/* Enhanced Header */}
      <div className="p-3 border-b border-border bg-card/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-medium text-foreground">Live Preview</h2>
            {isUpdating && (
              <div className="flex items-center gap-1 text-xs text-primary animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Updating...</span>
              </div>
            )}
          </div>
          
          {markdown.trim() && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>{wordCount} words</span>
              </div>
              <div className="text-xs opacity-75">
                ~{estimatedReadTime} min read
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-card relative">
        <div 
          key={contentKey}
          className={`
            p-6 prose prose-gray dark:prose-invert max-w-none
            prose-headings:text-card-foreground prose-headings:scroll-mt-8
            prose-p:text-card-foreground prose-p:leading-relaxed
            prose-strong:text-card-foreground prose-strong:font-semibold
            prose-em:text-card-foreground/90
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
            prose-pre:bg-muted prose-pre:text-muted-foreground prose-pre:border prose-pre:border-border prose-pre:rounded-lg
            prose-blockquote:text-card-foreground prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-md
            prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80 hover:prose-a:underline prose-a:transition-all prose-a:duration-200
            prose-ul:text-card-foreground prose-ol:text-card-foreground
            prose-li:text-card-foreground prose-li:my-1
            prose-table:text-card-foreground prose-thead:border-border prose-tr:border-border
            prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2
            prose-td:px-4 prose-td:py-2
            prose-hr:border-border prose-hr:my-8
            animate-in fade-in duration-300
            ${className}
          `}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          data-testid="content-markdown-preview"
        />
        
        {/* Subtle scroll indicator */}
        {markdown.trim() && (
          <div className="absolute top-0 right-0 w-1 bg-gradient-to-b from-primary/20 to-transparent h-full pointer-events-none" />
        )}
      </div>
    </div>
  );
}

export default MarkdownPreview;