import { useState } from 'react';
import MarkdownEditor from '../MarkdownEditor';

export default function MarkdownEditorExample() {
  const [value, setValue] = useState('# Hello World\n\nStart typing your markdown here...');

  return (
    <div className="h-96">
      <MarkdownEditor
        value={value}
        onChange={setValue}
        placeholder="Type your markdown here..."
      />
    </div>
  );
}