import MarkdownPreview from '../MarkdownPreview';

const sampleMarkdown = `# Welcome to Markdown Preview

This is a **sample markdown** document to demonstrate the preview functionality.

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- Lists and code blocks
- Blockquotes

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote with yellow accent border.

1. Numbered list item
2. Another item
3. Final item

---

The preview updates in real-time as you type!`;

export default function MarkdownPreviewExample() {
  return (
    <div className="h-96">
      <MarkdownPreview markdown={sampleMarkdown} />
    </div>
  );
}