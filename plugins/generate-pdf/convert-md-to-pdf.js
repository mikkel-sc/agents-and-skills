// convert-md-to-pdf.js
const fs = require("fs");
const path = require("path");
const markdownpdf = require("markdown-pdf");

function convertMarkdownToPDF(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    // Create default CSS for page breaks on headers
    const defaultCSS = `
      /* Page breaks before H1 and H2 headers */
      h1, h2 {
        page-break-before: always;
      }

      /* Prevent page break before first heading */
      h1:first-of-type, h2:first-of-type {
        page-break-before: avoid;
      }

      /* Additional styling */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        line-height: 1.6;
      }

      img {
        max-width: 100%;
        height: auto;
      }
    `;

    // Write CSS to temp file if no custom CSS provided
    let cssPath = options.cssPath;
    let tempCSSFile = null;

    if (!cssPath) {
      tempCSSFile = path.join(__dirname, '.temp-pdf-style.css');
      fs.writeFileSync(tempCSSFile, defaultCSS);
      cssPath = tempCSSFile;
    }

    // Configure options
    const pdfOptions = {
      cssPath: cssPath,
      paperFormat: options.paperFormat || "A4",
      paperOrientation: options.paperOrientation || "portrait",
      paperBorder: options.paperBorder || "2cm",
      remarkable: {
        html: true,
        breaks: true,
      },
      // Enable image rendering in PDFs
      renderDelay: 1000, // Wait for images to load
    };

    // Create PDF
    markdownpdf(pdfOptions)
      .from(inputPath)
      .to(outputPath, (err) => {
        // Clean up temp CSS file
        if (tempCSSFile && fs.existsSync(tempCSSFile)) {
          fs.unlinkSync(tempCSSFile);
        }

        if (err) {
          reject(err);
        } else {
          resolve(outputPath);
        }
      });
  });
}

// CLI usage
if (require.main === module) {
  const [inputPath, outputPath] = process.argv.slice(2);

  if (!inputPath || !outputPath) {
    console.error("Usage: node convert-md-to-pdf.js <input.md> <output.pdf>");
    process.exit(1);
  }

  convertMarkdownToPDF(inputPath, outputPath)
    .then((path) => {
      const stats = fs.statSync(path);
      console.log(`PDF generated successfully: ${path}`);
      console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
    })
    .catch((err) => {
      console.error("Error generating PDF:", err.message);
      process.exit(1);
    });
}

module.exports = { convertMarkdownToPDF };
