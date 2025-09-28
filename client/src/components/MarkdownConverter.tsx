import { useState, useMemo, useCallback, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import { PanelLeftClose, PanelLeftOpen, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import ActionButtons from './ActionButtons';

// Sample markdown content for the "Load Sample" button
const SAMPLE_MARKDOWN = `# Markdown → PDF / Word Converter

**Welcome to the ultimate markdown converter!** This tool lets you write in Markdown and export to PDF or Word format.

## Features

### Core Functionality
- ✅ **Live Preview**: See your markdown rendered in real-time
- ✅ **PDF Export**: Generate A4 portrait PDFs with custom styling
- ✅ **Word Export**: Create .doc files compatible with Microsoft Word
- ✅ **Dark Theme**: Easy on the eyes with warm yellow accents
- ✅ **Responsive Design**: Works on desktop and mobile

### Markdown Support
- **Bold** and *italic* text
- [Links](https://github.com/markdown-it/markdown-it)
- \`inline code\` and code blocks
- Lists, tables, and blockquotes
- HTML tags (when needed)

### Code Example

\`\`\`javascript
// Simple function to greet users
function greetUser(name) {
  return \`Hello, \${name}! Welcome to our Markdown converter.\`;
}

console.log(greetUser('Developer'));
\`\`\`

### Styling Features

> **Tip**: Blockquotes use the warm yellow accent color for a professional look.
>
> Perfect for callouts, tips, or important notes in your documents.

#### Lists Work Great

1. **Numbered lists** for step-by-step instructions
2. **Bullet points** for feature lists
3. **Nested items** for detailed breakdowns
   - Sub-item one
   - Sub-item two
   - Sub-item three

---

### Export Options

| Format | File Type | Use Case |
|--------|-----------|----------|
| PDF | .pdf | Sharing, printing, archiving |
| Word | .doc | Collaborative editing |
| HTML | Copy to clipboard | Web publishing |

**Ready to start?** Clear this sample and begin writing your own content!

---

*Made with ❤️ for productivity and clean document creation.*`;

type MobileTab = 'editor' | 'preview';

/**
 * Enhanced main application component with smooth animations and improved mobile UX
 * Features: Animated tab switching, responsive layout, swipe gestures, better visual feedback
 */
function MarkdownConverter() {
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState<MobileTab>('editor');
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Initialize markdown-it for HTML generation
  const md = useMemo(() => {
    return new MarkdownIt({
      html: true,        // Enable HTML tags in source
      linkify: true,     // Autoconvert URL-like text to links
      typographer: true, // Enable smart quotes and other typography
    });
  }, []);

  // Generate HTML content for exports
  const htmlContent = useMemo(() => {
    if (!markdown.trim()) {
      return '';
    }
    return md.render(markdown);
  }, [markdown, md]);

  // Load sample markdown content
  const handleLoadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
  };

  // Clear the editor
  const handleClear = () => {
    setMarkdown('');
  };

  // Enhanced copy function with better error handling
  const handleCopyHtml = useCallback(async () => {
    if (!htmlContent.trim()) {
      alert('Please add some markdown content first!');
      return;
    }

    try {
      await navigator.clipboard.writeText(htmlContent);
    } catch (error) {
      console.error('Failed to copy HTML:', error);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = htmlContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('HTML copied to clipboard!');
      } catch (fallbackError) {
        alert('Failed to copy HTML. Please try again.');
      }
      document.body.removeChild(textArea);
    }
  }, [htmlContent]);

  // Enhanced tab switching with animations
  const handleTabSwitch = useCallback((tab: MobileTab) => {
    setActiveTab(tab);
  }, []);

  // Touch handlers for swipe gestures on mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartX) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Swipe threshold (minimum distance for swipe)
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left - show preview
        setActiveTab('preview');
      } else {
        // Swiped right - show editor
        setActiveTab('editor');
      }
    }
    
    setTouchStartX(null);
  }, [touchStartX]);

  // Auto-switch to preview when content is added (mobile only)
  useEffect(() => {
    if (markdown.length > 50 && activeTab === 'editor' && window.innerWidth < 1024) {
      // Auto-suggest switching to preview after user types some content
      const timeout = setTimeout(() => {
        if (document.hidden === false) { // Only if tab is active
          setActiveTab('preview');
        }
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [markdown, activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500">
      {/* Enhanced Header with animations */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <span className="text-primary animate-pulse">→</span>
                Markdown → PDF / Word
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert your markdown to professional documents
              </p>
            </div>
            
            {/* Desktop Layout Toggle */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditorCollapsed(!isEditorCollapsed)}
                className="flex items-center gap-2"
              >
                {isEditorCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                {isEditorCollapsed ? 'Show Editor' : 'Focus Preview'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <ActionButtons
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onCopyHtml={handleCopyHtml}
        htmlContent={htmlContent}
        markdownContent={markdown}
      />

      {/* Main Content - Enhanced Responsive Layout */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">
          {/* Desktop: Enhanced two columns with collapse feature */}
          <div className="hidden lg:grid h-full transition-all duration-300" style={{
            gridTemplateColumns: isEditorCollapsed ? '0fr 1fr' : '1fr 1fr'
          }}>
            <div className={`border-r border-border overflow-hidden transition-all duration-300 ${
              isEditorCollapsed ? 'opacity-0' : 'opacity-100'
            }`}>
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                placeholder="Type your markdown here..."
              />
            </div>
            <div className="relative">
              <MarkdownPreview markdown={markdown} />
              
              {/* Overlay toggle button when collapsed */}
              {isEditorCollapsed && (
                <Button
                  onClick={() => setIsEditorCollapsed(false)}
                  className="absolute top-4 left-4 z-10 animate-in fade-in duration-200"
                  size="sm"
                  variant="outline"
                >
                  <PanelLeftOpen className="w-4 h-4 mr-2" />
                  Show Editor
                </Button>
              )}
            </div>
          </div>

          {/* Mobile: Enhanced layout with smooth animations and swipe support */}
          <div 
            className="lg:hidden h-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Enhanced Tab Bar */}
            <div className="flex border-b border-border bg-card/50 backdrop-blur-sm relative">
              <button 
                className={`flex-1 p-3 text-sm font-medium border-r border-border transition-all duration-300 relative ${
                  activeTab === 'editor' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                data-testid="tab-editor"
                onClick={() => handleTabSwitch('editor')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Editor
                  {markdown.length > 0 && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                {activeTab === 'editor' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in slide-in-from-left duration-200" />
                )}
              </button>
              
              <button 
                className={`flex-1 p-3 text-sm font-medium transition-all duration-300 relative ${
                  activeTab === 'preview' 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                data-testid="tab-preview"
                onClick={() => handleTabSwitch('preview')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Preview
                  {htmlContent.length > 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                {activeTab === 'preview' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in slide-in-from-right duration-200" />
                )}
              </button>
              
              {/* Swipe hint indicator */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Content with smooth transitions */}
            <div className="relative h-[calc(100%-48px)] overflow-hidden">
              <div 
                className="flex h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(${activeTab === 'editor' ? '0%' : '-100%'})`
                }}
              >
                <div className="w-full flex-shrink-0">
                  <MarkdownEditor
                    value={markdown}
                    onChange={setMarkdown}
                    placeholder="Type your markdown here..."
                  />
                </div>
                <div className="w-full flex-shrink-0">
                  <MarkdownPreview markdown={markdown} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-border bg-background/95 backdrop-blur-sm animate-in slide-in-from-bottom duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            made by Ujwal Guru
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MarkdownConverter;