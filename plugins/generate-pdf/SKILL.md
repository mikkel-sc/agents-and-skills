---
name: generating-pdf
description: Expert in converting markdown files to PDF using markdown-pdf Node.js library. Use this skill when the user wants to generate a PDF from markdown content, create presentation handouts, or export documentation. Handles markdown-to-PDF conversion with proper formatting and styling.
---

# Generating PDF from Markdown

Convert markdown files to professionally formatted PDF documents using the `markdown-pdf` Node.js library.

## When to Use This Skill

- User requests PDF generation from markdown files
- Converting presentation slides to PDF format
- Creating documentation exports
- Generating handouts or reports from markdown content

## Approach

### 1. Assess Requirements

First, determine:

- Source markdown file location
- Desired output PDF filename and location
- Any styling requirements (CSS customization)
- Whether images or assets need to be included (images are automatically embedded)

### 2. Install Dependencies

Ensure `markdown-pdf` is installed:

```bash
npm install markdown-pdf
```

### 3. Implementation Pattern

Use the provided `convert-md-to-pdf.js` script in this skill's directory. The script automatically:
- Applies page breaks before H1 and H2 headers
- Embeds images as base64
- Includes responsive styling
- Handles CSS generation and cleanup

**Script location**: `convert-md-to-pdf.js` (in same directory as this SKILL.md)

**Usage**:
```bash
node convert-md-to-pdf.js <input.md> <output.pdf>
```

The script accepts two arguments:
1. Path to input markdown file
2. Path to output PDF file

### 4. Custom Styling (Optional)

For advanced styling customization, see [[custom-styling.md]] for CSS examples and techniques.

### 5. Execution Workflow

When the user requests PDF generation:

1. Check if `markdown-pdf` is installed (install if needed with `npm install markdown-pdf`)
2. Locate the input markdown file path
3. Determine the output PDF file path
4. Run the conversion script from this skill's directory:
   ```bash
   node ~/.claude/skills/generate-pdf/convert-md-to-pdf.js <input.md> <output.pdf>
   ```
5. Verify PDF was created and report file location and size to user

### 6. Error Handling

Common issues and solutions:

- **Missing dependencies**: Run `npm install markdown-pdf`
- **File not found**: Verify input path is correct and file exists
- **Permission errors**: Ensure write permissions for output directory
- **Images not showing**:
  - Use absolute paths in markdown: `![Alt text](/absolute/path/to/image.png)`
  - Or use relative paths: `![Alt text](./images/image.png)`
  - Ensure image files exist at specified locations
  - Images are automatically embedded in the PDF (base64 encoded)

## Output Format

Always confirm to the user:

- The PDF file location
- File size in KB or MB
- Whether the conversion succeeded or failed

## Notes

- `markdown-pdf` uses PhantomJS under the hood for PDF generation
- For landscape orientation, use: `paperOrientation: 'landscape'`
- Paper formats: 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'
- Custom margins with: `paperBorder: '1cm'` or `paperBorder: { top: '2cm', right: '1cm', bottom: '2cm', left: '1cm' }`

## Page Breaks

- **Automatic page breaks**: H1 and H2 headers automatically start on a new page
- The first heading in the document won't trigger a page break (prevents blank first page)
- Page break CSS: `page-break-before: always` is applied to h1 and h2 elements
- Default CSS is automatically created and applied if no custom CSS is provided
- To disable page breaks, provide a custom CSS file via `options.cssPath`

## Image Handling

- **Images are automatically embedded in PDFs** - markdown-pdf converts images to base64 and includes them directly
- Supported formats: PNG, JPG, JPEG, GIF, SVG
- Use markdown image syntax: `![Alt text](path/to/image.png)`
- **Relative paths**: Images relative to markdown file location work automatically
- **Absolute paths**: Can be used for images outside the markdown directory
- **renderDelay option**: Set to 1000ms or higher to ensure images load before PDF generation
- Image dimensions can be controlled with HTML: `<img src="path.png" width="400">`
