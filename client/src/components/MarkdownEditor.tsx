import { forwardRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Markdown editor with monospace font and vertical resize capability
 * Uses textarea with custom styling for the dark theme
 */
const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ value, onChange, placeholder = "Type your markdown here...", className = "" }, ref) => {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-border">
          <h2 className="text-sm font-medium text-foreground">Markdown Editor</h2>
        </div>
        <div className="flex-1 p-4">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`
              w-full h-full resize-none
              bg-background text-foreground
              font-mono text-sm leading-relaxed
              border border-input rounded-md
              p-4 focus:outline-none focus:ring-2 focus:ring-ring
              placeholder:text-muted-foreground
              ${className}
            `}
            data-testid="input-markdown-editor"
            style={{ resize: 'vertical', minHeight: '200px' }}
          />
        </div>
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;