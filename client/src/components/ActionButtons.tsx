import { Button } from '@/components/ui/button';
import { Download, FileText, RotateCcw, Copy, FileDown } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ActionButtonsProps {
  onLoadSample: () => void;
  onClear: () => void;
  onCopyHtml: () => void;
  htmlContent: string;
  markdownContent: string;
}

/**
 * Action buttons toolbar with PDF/Word download, sample load, clear, and copy HTML functionality
 * Includes comments for easy customization of colors, PDF options, and filenames
 */
function ActionButtons({ onLoadSample, onClear, onCopyHtml, htmlContent, markdownContent }: ActionButtonsProps) {

  // PDF download function using html2pdf.js
  const handleDownloadPDF = async () => {
    if (!htmlContent.trim() || htmlContent.includes('Preview will appear here')) {
      alert('Please add some markdown content first!');
      return;
    }

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
          <body>${htmlContent}</body>
        </html>
      `;

      const element = document.createElement('div');
      element.innerHTML = cleanHtml;
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Word document download function
  const handleDownloadWord = () => {
    if (!htmlContent.trim() || htmlContent.includes('Preview will appear here')) {
      alert('Please add some markdown content first!');
      return;
    }

    try {
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
        <body>${htmlContent}</body>
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
    } catch (error) {
      console.error('Word generation failed:', error);
      alert('Failed to generate Word document. Please try again.');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 border-b border-border bg-background">
      <Button 
        onClick={handleDownloadPDF}
        className="flex items-center gap-2"
        data-testid="button-download-pdf"
      >
        <Download className="w-4 h-4" />
        Download PDF
      </Button>
      
      <Button 
        variant="outline"
        onClick={handleDownloadWord}
        className="flex items-center gap-2"
        data-testid="button-download-word"
      >
        <FileText className="w-4 h-4" />
        Download Word (.doc)
      </Button>
      
      <Button 
        variant="outline"
        onClick={onLoadSample}
        className="flex items-center gap-2"
        data-testid="button-load-sample"
      >
        <FileDown className="w-4 h-4" />
        Load Sample
      </Button>
      
      <Button 
        variant="outline"
        onClick={onClear}
        className="flex items-center gap-2"
        data-testid="button-clear"
      >
        <RotateCcw className="w-4 h-4" />
        Clear
      </Button>
      
      <Button 
        variant="outline"
        onClick={onCopyHtml}
        className="flex items-center gap-2"
        data-testid="button-copy-html"
      >
        <Copy className="w-4 h-4" />
        Copy HTML
      </Button>
    </div>
  );
}

export default ActionButtons;