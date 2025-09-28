import { useState } from 'react';
import ActionButtons from '../ActionButtons';

const sampleHtml = '<h1>Sample Document</h1><p>This is a sample HTML content for testing the action buttons.</p><p><strong>Bold text</strong> and <em>italic text</em>.</p>';

export default function ActionButtonsExample() {
  const [feedback, setFeedback] = useState('');

  const handleLoadSample = () => {
    console.log('Load sample triggered');
    setFeedback('Sample markdown loaded!');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleClear = () => {
    console.log('Clear triggered');
    setFeedback('Editor cleared!');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleCopyHtml = () => {
    console.log('Copy HTML triggered');
    setFeedback('HTML copied to clipboard!');
    setTimeout(() => setFeedback(''), 2000);
  };

  return (
    <div>
      <ActionButtons
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onCopyHtml={handleCopyHtml}
        htmlContent={sampleHtml}
        markdownContent="# Sample\n\nSample markdown content"
      />
      {feedback && (
        <div className="p-4 text-sm text-primary font-medium">
          {feedback}
        </div>
      )}
    </div>
  );
}