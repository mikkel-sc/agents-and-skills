# Generate PDF Plugin

A skill for converting markdown files to professionally formatted PDF documents.

## Overview

The Generate PDF Plugin provides expert guidance for converting markdown content to PDF format using the `markdown-pdf` Node.js library. It handles markdown-to-PDF conversion with proper formatting, styling, automatic page breaks, and embedded images.

## Features

### Skill: `generating-pdf`

Expert skill for markdown-to-PDF conversion with professional formatting.

**What it does:**

- Converts markdown files to PDF with proper formatting
- Automatically applies page breaks before H1 and H2 headers
- Embeds images as base64 (no external file dependencies)
- Includes responsive styling and custom CSS support
- Handles error cases and provides detailed feedback

**When to use:**

- Converting presentation slides to PDF format
- Creating documentation exports
- Generating handouts or reports from markdown content
- Exporting markdown files for distribution or printing

**Usage:**

```bash
node convert-md-to-pdf.js <input.md> <output.pdf>
```

Or simply ask:

```
"Convert my presentation.md to PDF"
"Generate a PDF from this markdown file"
"Create a PDF handout from the documentation"
```

**Output:**
The skill confirms the PDF file location, file size, and whether conversion succeeded or failed.

## Quick Start

### Prerequisites

```bash
npm install markdown-pdf
```

### Basic Conversion

```bash
node convert-md-to-pdf.js input.md output.pdf
```

### Custom Styling (Optional)

See `custom-styling.md` for CSS examples and advanced customization techniques.

## Features

### Automatic Page Breaks

- H1 and H2 headers automatically start on a new page
- First heading in document won't trigger a page break (prevents blank first page)
- Can be customized via CSS

### Image Handling

- **Automatically embedded** - images converted to base64 and included in PDF
- Supported formats: PNG, JPG, JPEG, GIF, SVG
- Relative paths work automatically (relative to markdown file location)
- Absolute paths supported for external images
- Responsive sizing with max-width: 100%

### Default Styling

Built-in styling includes:

- Modern font family (system fonts)
- Proper line height (1.6) for readability
- Responsive images
- Page breaks on major headings
- Professional spacing and margins

### Custom Options

Customize via the conversion script:

- **Paper format**: 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
- **Orientation**: 'portrait' or 'landscape'
- **Margins**: Custom border sizes (e.g., '2cm', or individual margins)
- **CSS**: Provide custom stylesheet path
- **Render delay**: Adjust timeout for image loading

## Workflow Example

1. **Request PDF generation:**

```
"Convert my meeting-notes.md to PDF"
```

2. **Skill checks dependencies** and installs if needed

3. **Conversion runs** with automatic formatting:

   - Page breaks on headers
   - Images embedded
   - Professional styling applied

4. **Confirmation provided:**

```
PDF generated successfully: meeting-notes.pdf
File size: 245.32 KB
```

## Common Issues

### Missing Dependencies

**Problem:** `markdown-pdf` not installed

**Solution:** Run `npm install markdown-pdf`

### Images Not Showing

**Problem:** Images missing in PDF

**Solution:**

- Use absolute paths: `![Alt](/full/path/to/image.png)`
- Or relative paths: `![Alt](./images/image.png)`
- Ensure image files exist at specified locations
- Images are automatically base64 encoded and embedded

### Permission Errors

**Problem:** Cannot write PDF to output directory

**Solution:** Ensure write permissions for output directory

## Advanced Customization

### Custom CSS Styling

Create a custom CSS file for advanced styling:

```css
/* custom-style.css */
h1 {
  color: #2c3e50;
  font-size: 24pt;
  border-bottom: 2px solid #3498db;
}

code {
  background-color: #f4f4f4;
  padding: 2px 5px;
  font-family: "Courier New", monospace;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  background-color: #3498db;
  color: white;
}
```

See `custom-styling.md` for complete examples.

### Programmatic Usage

```javascript
const { convertMarkdownToPDF } = require("./convert-md-to-pdf");

convertMarkdownToPDF("input.md", "output.pdf", {
  paperFormat: "A4",
  paperOrientation: "portrait",
  paperBorder: "2cm",
  cssPath: "custom-style.css",
})
  .then((path) => console.log(`PDF created: ${path}`))
  .catch((err) => console.error("Error:", err));
```

## Files in This Plugin

- **SKILL.md** - Skill definition and comprehensive documentation
- **convert-md-to-pdf.js** - Conversion script with default styling
- **custom-styling.md** - CSS examples and styling guide
- **README.md** - This file

## Technical Details

- **PDF Engine**: PhantomJS (via markdown-pdf)
- **Markdown Parser**: Remarkable (with HTML and line breaks enabled)
- **Image Encoding**: Base64 embedding (no external dependencies)
- **Render Delay**: 1000ms default (ensures images load before PDF generation)
- **Default Paper**: A4, portrait, 2cm margins

## Resources

- [markdown-pdf on npm](https://www.npmjs.com/package/markdown-pdf)
- [Markdown Guide](https://www.markdownguide.org/)
- See `custom-styling.md` for CSS styling examples

## Version

1.0.0
