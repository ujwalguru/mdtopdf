import { forwardRef, useState, useEffect, useMemo } from 'react';
import { FileText, Type, Clock } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Enhanced Markdown editor with statistics, auto-save indicator, and smooth animations
 * Features: character count, word count, line count, typing indicator
 */
const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(
  ({ value, onChange, placeholder = "Type your markdown here...", className = "" }, ref) => {
    const [isTyping, setIsTyping] = useState(false);
    const [lastEdit, setLastEdit] = useState<Date | null>(null);
    
    // Calculate statistics
    const stats = useMemo(() => {
      const text = value || '';
      const characters = text.length;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const lines = text.split('\n').length;
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== '').length;
      
      return { characters, words, lines, paragraphs };
    }, [value]);

    // Handle typing indicator and last edit timestamp
    useEffect(() => {
      if (value) {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
          setLastEdit(new Date());
        }, 1500);
        
        return () => clearTimeout(timeout);
      }
    }, [value]);

    const formatLastEdit = (date: Date | null) => {
      if (!date) return 'Start typing...';
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const seconds = Math.floor(diff / 1000);
      
      if (seconds < 5) return 'Just edited';
      if (seconds < 60) return `Edited ${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `Edited ${minutes}m ago`;
      return `Edited at ${date.toLocaleTimeString()}`;
    };

    return (
      <div className="h-full flex flex-col animate-in slide-in-from-left duration-300">
        {/* Enhanced Header with Statistics */}
        <div className="p-3 border-b border-border bg-card/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-medium text-foreground">Markdown Editor</h2>
              {isTyping && (
                <div className="flex items-center gap-1 text-xs text-primary animate-pulse">
                  <Type className="w-3 h-3" />
                  <span>Typing...</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className={`transition-colors duration-200 ${
                  isTyping ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {formatLastEdit(lastEdit)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Statistics Bar */}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="transition-all duration-200 hover:text-foreground">
              {stats.characters} characters
            </span>
            <span className="transition-all duration-200 hover:text-foreground">
              {stats.words} words
            </span>
            <span className="transition-all duration-200 hover:text-foreground">
              {stats.lines} lines
            </span>
            <span className="transition-all duration-200 hover:text-foreground">
              {stats.paragraphs} paragraphs
            </span>
          </div>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 p-4 relative">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            placeholder={placeholder}
            className={`
              w-full h-full resize-none
              bg-background text-foreground
              font-mono text-sm leading-relaxed
              border border-input rounded-md
              p-4 focus:outline-none focus:ring-2 focus:ring-ring
              focus:border-primary transition-all duration-200
              placeholder:text-muted-foreground
              ${className}
            `}
            data-testid="input-markdown-editor"
            style={{ resize: 'vertical', minHeight: '200px' }}
          />
          
          {/* Typing Indicator Overlay */}
          {isTyping && (
            <div className="absolute bottom-6 right-6 bg-primary/10 backdrop-blur-sm rounded-full px-3 py-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-1 text-xs text-primary">
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="ml-1">Typing</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;