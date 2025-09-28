import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, RotateCcw, Copy, FileDown, Loader2, CheckCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import DOMPurify from 'dompurify';
import { useToast } from './ToastProvider';

interface ActionButtonsProps {
  onLoadSample: () => void;
  onClear: () => void;
  onCopyHtml: () => void;
  htmlContent: string;
  markdownContent: string;
}

type LoadingState = {
  pdf: boolean;
  word: boolean;
  copy: boolean;
};

type SuccessState = {
  copy: boolean;
};

/**
 * Enhanced Action buttons toolbar with loading states, success animations, and improved UX
 * Features: Loading spinners, success indicators, smooth transitions
 */
function ActionButtons({ onLoadSample, onClear, onCopyHtml, htmlContent, markdownContent }: ActionButtonsProps) {
  const [loading, setLoading] = useState<LoadingState>({
    pdf: false,
    word: false,
    copy: false
  });
  
  const [success, setSuccess] = useState<SuccessState>({
    copy: false
  });
  
  const { showToast } = useToast();

  // PDF download function with loading states and progress indication
  const handleDownloadPDF = async () => {
    if (!htmlContent.trim() || htmlContent.includes('Preview will appear here')) {
      showToast('Please add some markdown content first!', 'info');
      return;
    }

    setLoading(prev => ({ ...prev, pdf: true }));
    
    try {
      // PDF configuration options - easily customizable
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number], // Top, right, bottom, left margins in inches
        filename: 'markdown-document.pdf', // Default filename - easily changeable
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', // A4 portrait format as requested
          orientation: 'portrait' as const
        }
      };

      // Sanitize HTML content for PDF generation
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'a', 'ul', 'ol', 'li', 'blockquote',
          'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'hr', 'img', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'alt', 'title', 'class'],
        FORBID_CONTENTS: ['script', 'style'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
      });
      
      // Create a clean HTML document for PDF generation
      const cleanHtml = `
        <html>
          <head>
            <style>
              body { 
                font-family: Georgia, serif; 
                line-height: 1.6; 
                color: #333; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: white;
              }
              h1, h2, h3, h4, h5, h6 { color: #2c3e50; margin-top: 1.5em; }
              pre { background: #f4f4f4; padding: 1em; border-radius: 4px; }
              code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
              blockquote { 
                border-left: 4px solid #ffd24a; 
                margin: 1em 0; 
                padding-left: 1em; 
                color: #666; 
              }
              a { color: #3498db; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>${sanitizedHtml}</body>
        </html>
      `;

      const element = document.createElement('div');
      element.innerHTML = cleanHtml;
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      await html2pdf().set(opt).from(element).save();
      showToast('PDF downloaded successfully!', 'success');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, pdf: false }));
    }
  };

  // Word document download function with loading state
  const handleDownloadWord = async () => {
    if (!htmlContent.trim() || htmlContent.includes('Preview will appear here')) {
      showToast('Please add some markdown content first!', 'info');
      return;
    }

    setLoading(prev => ({ ...prev, word: true }));
    
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));
      // Sanitize HTML content for Word export
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'a', 'ul', 'ol', 'li', 'blockquote',
          'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'hr', 'img', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'alt', 'title', 'class'],
        FORBID_CONTENTS: ['script', 'style'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
      });
      
      // Create Word-compatible HTML with proper styling
      const wordHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Markdown Document</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowInsertionsAndDeletions/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            @page { margin: 1in; }
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 12pt; 
              line-height: 1.5;
              color: #000;
            }
            h1, h2, h3, h4, h5, h6 { color: #2c3e50; }
            pre, code { 
              font-family: 'Courier New', monospace; 
              background-color: #f5f5f5;
            }
            blockquote { 
              border-left: 3px solid #ffd24a; 
              margin: 1em 0; 
              padding-left: 1em; 
            }
          </style>
        </head>
        <body>${sanitizedHtml}</body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([wordHtml], { 
        type: 'application/msword;charset=utf-8' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'markdown-document.doc'; // Default filename - easily changeable
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Word document downloaded successfully!', 'success');
    } catch (error) {
      console.error('Word generation failed:', error);
      showToast('Failed to generate Word document. Please try again.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, word: false }));
    }
  };

  // Enhanced copy function with HTML sanitization
  const handleEnhancedCopyHtml = async () => {
    if (!htmlContent.trim() || htmlContent.includes('Preview will appear here')) {
      showToast('Please add some markdown content first!', 'info');
      return;
    }
    
    setLoading(prev => ({ ...prev, copy: true }));
    
    try {
      // Sanitize HTML before copying
      const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: [
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'p', 'br', 'strong', 'em', 'u', 's', 'del',
          'a', 'ul', 'ol', 'li', 'blockquote',
          'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'hr', 'img', 'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'alt', 'title', 'class'],
        FORBID_CONTENTS: ['script', 'style'],
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed']
      });
      
      await navigator.clipboard.writeText(sanitizedHtml);
      setSuccess(prev => ({ ...prev, copy: true }));
      showToast('HTML copied to clipboard!', 'success');
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, copy: false }));
      }, 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      showToast('Failed to copy HTML. Please try again.', 'error');
    } finally {
      setLoading(prev => ({ ...prev, copy: false }));
    }
  };

  return (
    <div className="border-b border-border bg-background/95 backdrop-blur-sm animate-in slide-in-from-top duration-300">
      <div className="flex flex-wrap gap-2 p-4">
        <Button 
          onClick={handleDownloadPDF}
          disabled={loading.pdf}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          data-testid="button-download-pdf"
        >
          {loading.pdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {loading.pdf ? 'Generating PDF...' : 'Download PDF'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleDownloadWord}
          disabled={loading.word}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          data-testid="button-download-word"
        >
          {loading.word ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          {loading.word ? 'Generating...' : 'Download Word (.doc)'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onLoadSample}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:text-primary"
          data-testid="button-load-sample"
        >
          <FileDown className="w-4 h-4 transition-transform duration-200 hover:translate-y-0.5" />
          Load Sample
        </Button>
        
        <Button 
          variant="outline"
          onClick={onClear}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 hover:text-destructive"
          data-testid="button-clear"
        >
          <RotateCcw className="w-4 h-4 transition-transform duration-200 hover:rotate-180" />
          Clear
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleEnhancedCopyHtml}
          disabled={loading.copy}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95"
          data-testid="button-copy-html"
        >
          {loading.copy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : success.copy ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {loading.copy ? 'Copying...' : success.copy ? 'Copied!' : 'Copy HTML'}
        </Button>
      </div>
      
      {/* Progress indicator when any action is loading */}
      {(loading.pdf || loading.word || loading.copy) && (
        <div className="h-1 bg-muted overflow-hidden">
          <div className="h-full bg-primary animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default ActionButtons;