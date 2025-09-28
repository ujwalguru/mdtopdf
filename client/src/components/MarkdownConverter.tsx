import { useState, useMemo } from 'react';
import MarkdownIt from 'markdown-it';
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

/**
 * Main application component that combines the markdown editor, live preview, and action buttons
 * Provides a responsive two-column layout that stacks on mobile devices
 */
function MarkdownConverter() {
  const [markdown, setMarkdown] = useState('');

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

  // Copy HTML to clipboard
  const handleCopyHtml = async () => {
    if (!htmlContent.trim()) {
      alert('Please add some markdown content first!');
      return;
    }

    try {
      await navigator.clipboard.writeText(htmlContent);
      // Show temporary feedback (you could enhance this with a toast notification)
      const button = document.querySelector('[data-testid="button-copy-html"]');
      const originalText = button?.textContent || 'Copy HTML';
      if (button) {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
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
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Markdown → PDF / Word
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Convert your markdown to professional documents
          </p>
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

      {/* Main Content - Responsive Layout */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto h-[calc(100vh-180px)]">
          {/* Desktop: Two columns side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 h-full">
            <div className="border-r border-border">
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                placeholder="Type your markdown here..."
              />
            </div>
            <div>
              <MarkdownPreview markdown={markdown} />
            </div>
          </div>

          {/* Mobile: Stacked layout with tabs-like switching */}
          <div className="lg:hidden h-full">
            <div className="flex border-b border-border">
              <button 
                className="flex-1 p-3 text-sm font-medium border-r border-border hover-elevate"
                data-testid="tab-editor"
                onClick={() => {
                  document.getElementById('mobile-editor')?.classList.remove('hidden');
                  document.getElementById('mobile-preview')?.classList.add('hidden');
                }}
              >
                Editor
              </button>
              <button 
                className="flex-1 p-3 text-sm font-medium hover-elevate"
                data-testid="tab-preview"
                onClick={() => {
                  document.getElementById('mobile-editor')?.classList.add('hidden');
                  document.getElementById('mobile-preview')?.classList.remove('hidden');
                }}
              >
                Preview
              </button>
            </div>
            
            <div id="mobile-editor" className="h-[calc(100%-48px)]">
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                placeholder="Type your markdown here..."
              />
            </div>
            
            <div id="mobile-preview" className="h-[calc(100%-48px)] hidden">
              <MarkdownPreview markdown={markdown} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-center text-sm text-muted-foreground">
            made by Ujwal Guru
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MarkdownConverter;