# Design Guidelines: Markdown → PDF / Word Converter

## Design Approach
**System-Based Approach**: Using a utility-focused design system approach since this is a productivity tool where efficiency and usability are paramount. The interface should remain clean, distraction-free, and focused on the core functionality.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary:**
- Background: `220 25% 8%` (deep navy-black)
- Surface: `220 20% 12%` (slightly lighter navy)
- Text Primary: `0 0% 95%` (off-white)
- Text Secondary: `0 0% 70%` (muted gray)

**Accent Colors:**
- Primary Accent: `45 100% 64%` (warm yellow #ffd24a as specified)
- Accent Hover: `45 90% 58%` (slightly darker yellow for interactions)
- Success: `142 76% 36%` (subtle green for success states)
- Border: `220 15% 20%` (subtle border color)

### B. Typography
**Font System:**
- Interface: Inter or system font stack for UI elements
- Editor: JetBrains Mono or Fira Code for the markdown editor (monospace)
- Preview: Georgia or system serif for rendered markdown content

**Scale:**
- Headings: 1.5rem, 1.25rem, 1.125rem
- Body: 1rem (16px)
- Small: 0.875rem
- Code: 0.875rem in monospace

### C. Layout System
**Spacing Units:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Small gaps: `gap-2` (8px)
- Medium spacing: `p-4` (16px) 
- Large sections: `p-6` (24px)
- Major layout: `p-8` (32px)

**Responsive Breakpoints:**
- Mobile: Single column, full-width editor with collapsible preview
- Tablet/Desktop: Two-column 50/50 split with resizable divider

### D. Component Library

**Editor Panel:**
- Full-height textarea with monospace font
- Vertical resize handle (CSS resize: vertical)
- Subtle border with yellow accent on focus
- Dark background matching theme

**Preview Panel:**
- White/light background for content readability
- Scrollable container with proper typography
- Mimics document appearance for PDF preview accuracy

**Action Buttons:**
- Primary: Yellow background with dark text
- Secondary: Transparent with yellow border and yellow text
- Small, compact sizing to minimize visual weight
- Grouped in a horizontal toolbar

**Layout Structure:**
- Header: App title and main actions
- Main: Split editor/preview panels
- Footer: Attribution text as specified

### E. Interactions & States
**Minimal Animations:**
- Subtle hover states on buttons (brightness change)
- Smooth panel resizing
- No distracting transitions or effects

**Focus States:**
- Yellow border accent for form elements
- Clear visual hierarchy for keyboard navigation

## Visual Treatment
This is a utility application focused on productivity, so the design emphasizes:
- High contrast for readability
- Minimal visual distractions
- Clear functional hierarchy
- Professional, tool-like appearance
- Efficient use of screen space

The dark theme with yellow accents creates a modern, professional feel while reducing eye strain during extended use. The warm yellow provides sufficient contrast against the dark navy background for accessibility while maintaining the sophisticated aesthetic.

## Key Design Principles
1. **Functionality First**: Every element serves the core conversion workflow
2. **Distraction-Free**: Clean interface that doesn't compete with content
3. **Responsive Efficiency**: Layout adapts without losing functionality
4. **Professional Polish**: Refined details that inspire confidence in the tool