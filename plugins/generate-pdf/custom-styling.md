# Custom PDF Styling

This guide covers how to customize the appearance of generated PDFs using CSS.

## Creating a Custom CSS File

Create a CSS file with your desired styling:

```css
/* custom-pdf-style.css */
body {
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
}

h1, h2, h3 {
  color: #2c3e50;
  page-break-after: avoid;
}

h1 {
  font-size: 24pt;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

h2 {
  font-size: 18pt;
  margin-top: 20px;
}

h3 {
  font-size: 14pt;
  margin-top: 15px;
}

code {
  background-color: #f4f4f4;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 11pt;
}

pre {
  background-color: #f8f8f8;
  padding: 15px;
  border-left: 4px solid #3498db;
  overflow-x: auto;
  font-size: 10pt;
}

pre code {
  background-color: transparent;
  padding: 0;
}

blockquote {
  border-left: 4px solid #ddd;
  margin: 0;
  padding-left: 15px;
  color: #666;
  font-style: italic;
}

table {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 15px auto;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

## Applying Custom CSS

Pass the CSS file path to the conversion function:

```javascript
convertMarkdownToPDF('input.md', 'output.pdf', {
  cssPath: 'custom-pdf-style.css'
});
```

Or via CLI by modifying the script to accept a CSS option:

```javascript
const [inputPath, outputPath, cssPath] = process.argv.slice(2);

convertMarkdownToPDF(inputPath, outputPath, { cssPath })
  .then(path => console.log(`PDF generated: ${path}`))
  .catch(err => console.error('Error:', err.message));
```

Then run:
```bash
node convert-md-to-pdf.js input.md output.pdf custom-pdf-style.css
```

## Styling Tips

### Page Breaks
Control page breaks to avoid awkward splits:
```css
h1, h2, h3 {
  page-break-after: avoid;
}

pre, blockquote {
  page-break-inside: avoid;
}
```

### Print-Specific Rules
Use print media queries for PDF-specific styling:
```css
@media print {
  .no-print {
    display: none;
  }

  a[href]:after {
    content: " (" attr(href) ")";
  }
}
```

### Font Sizing
Use point (pt) units for consistent print sizing:
- Body text: 10-12pt
- Headings: 14-24pt
- Code: 9-11pt

### Colors
Ensure sufficient contrast for readability:
- Dark text on light backgrounds
- Avoid pure black (#000) - use dark gray (#333) for easier reading
- Be mindful of printing costs if using heavy background colors
