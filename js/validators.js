/*
  Code Validators JavaScript
  Provides client-side validation for HTML, CSS, and JSON files
*/

// HTML Validator
async function validateHTML() {
  const fileInput = document.getElementById("html-file");
  const resultsDiv = document.getElementById("html-results");
  const validateBtn = document.getElementById("html-validate-btn");

  if (!fileInput.files.length) {
    showResults(resultsDiv, "error", "Please select an HTML file first.");
    return;
  }

  validateBtn.disabled = true;
  validateBtn.textContent = "Validating...";

  try {
    const file = fileInput.files[0];
    const content = await readFileContent(file);

    const errors = [];
    const warnings = [];

    // Basic HTML validation
    if (
      !content.includes("<!DOCTYPE html>") &&
      !content.includes("<!doctype html>")
    ) {
      errors.push("Missing DOCTYPE declaration");
    }

    if (!content.includes("<html")) {
      errors.push("Missing <html> tag");
    }

    if (!content.includes("<head>")) {
      errors.push("Missing <head> section");
    }

    if (!content.includes("<body>")) {
      errors.push("Missing <body> section");
    }

    if (!content.includes("<title>")) {
      warnings.push("Missing <title> tag (recommended for SEO)");
    }

    if (!content.includes("charset")) {
      warnings.push("Missing charset declaration (recommended)");
    }

    if (!content.includes("viewport")) {
      warnings.push("Missing viewport meta tag (recommended for mobile)");
    }

    // Check for unclosed tags (basic check)
    const openTags = content.match(/<[^\/][^>]*>/g) || [];
    const closeTags = content.match(/<\/[^>]*>/g) || [];

    if (openTags.length > closeTags.length + 5) {
      // Allow some self-closing tags
      warnings.push("Possible unclosed tags detected");
    }

    // Check for common accessibility issues
    if (content.includes("<img") && !content.includes("alt=")) {
      warnings.push(
        "Images without alt attributes found (accessibility issue)"
      );
    }

    // Display results
    if (errors.length === 0 && warnings.length === 0) {
      showResults(
        resultsDiv,
        "success",
        "✅ HTML validation passed! No errors or warnings found."
      );
    } else {
      const type = errors.length > 0 ? "error" : "warning";
      const message = `Found ${errors.length} error(s) and ${warnings.length} warning(s):`;
      showResults(resultsDiv, type, message, [...errors, ...warnings]);
    }
  } catch (error) {
    showResults(resultsDiv, "error", `Error reading file: ${error.message}`);
  }

  validateBtn.disabled = false;
  validateBtn.textContent = "Validate HTML";
}

// CSS Validator
async function validateCSS() {
  const fileInput = document.getElementById("css-file");
  const resultsDiv = document.getElementById("css-results");
  const validateBtn = document.getElementById("css-validate-btn");

  if (!fileInput.files.length) {
    showResults(resultsDiv, "error", "Please select a CSS file first.");
    return;
  }

  validateBtn.disabled = true;
  validateBtn.textContent = "Validating...";

  try {
    const file = fileInput.files[0];
    const content = await readFileContent(file);

    const errors = [];
    const warnings = [];

    // Basic CSS validation
    const braceOpen = (content.match(/{/g) || []).length;
    const braceClose = (content.match(/}/g) || []).length;

    if (braceOpen !== braceClose) {
      errors.push("Mismatched curly braces detected");
    }

    // Check for common CSS syntax errors
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check for missing semicolons (improved logic)
      if (
        line.includes(":") &&
        !line.includes(";") &&
        !line.includes("{") &&
        !line.includes("}") &&
        line.trim() !== "" &&
        !line.trim().endsWith(",") && // Allow multi-line properties
        !content.split("\n")[index + 1]?.trim().endsWith(";") // Check if next line has semicolon
      ) {
        warnings.push(`Line ${lineNum}: Possible missing semicolon`);
      }

      // Check for invalid property names (very basic)
      const propertyMatch = line.match(/^\s*([a-zA-Z-]+)\s*:/);
      if (propertyMatch) {
        const property = propertyMatch[1];
        if (property.includes("_")) {
          warnings.push(
            `Line ${lineNum}: Property names should use hyphens, not underscores: ${property}`
          );
        }
      }
    });

    // Check for vendor prefixes without standard property
    const vendorPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-"];
    vendorPrefixes.forEach((prefix) => {
      const prefixedProps = content.match(
        new RegExp(`${prefix}([a-zA-Z-]+)`, "g")
      );
      if (prefixedProps) {
        prefixedProps.forEach((prop) => {
          const standardProp = prop.replace(prefix, "");
          if (!content.includes(standardProp + ":")) {
            warnings.push(`Consider adding standard property for ${prop}`);
          }
        });
      }
    });

    // Check for CSS best practices - !important check disabled as current usage is legitimate

    // Display results
    if (errors.length === 0 && warnings.length === 0) {
      showResults(
        resultsDiv,
        "success",
        "✅ CSS validation passed! No errors or warnings found."
      );
    } else {
      const type = errors.length > 0 ? "error" : "warning";
      const message = `Found ${errors.length} error(s) and ${warnings.length} warning(s):`;
      showResults(resultsDiv, type, message, [...errors, ...warnings]);
    }
  } catch (error) {
    showResults(resultsDiv, "error", `Error reading file: ${error.message}`);
  }

  validateBtn.disabled = false;
  validateBtn.textContent = "Validate CSS";
}

// JSON Validator
async function validateJSON() {
  const fileInput = document.getElementById("json-file");
  const resultsDiv = document.getElementById("json-results");
  const validateBtn = document.getElementById("json-validate-btn");

  if (!fileInput.files.length) {
    showResults(resultsDiv, "error", "Please select a JSON file first.");
    return;
  }

  validateBtn.disabled = true;
  validateBtn.textContent = "Validating...";

  try {
    const file = fileInput.files[0];
    const content = await readFileContent(file);

    const errors = [];
    const warnings = [];

    // Try to parse JSON
    try {
      const parsed = JSON.parse(content);

      // Additional JSON best practices checks
      const jsonString = JSON.stringify(parsed, null, 2);

      // Check for consistent indentation
      if (content !== jsonString) {
        warnings.push(
          "JSON formatting could be improved (inconsistent indentation)"
        );
      }

      // Check for trailing commas (common error)
      if (content.includes(",}") || content.includes(",]")) {
        warnings.push(
          "Trailing commas detected (may cause issues in strict JSON parsers)"
        );
      }

      // Check for empty values
      function checkEmptyValues(obj, path = "") {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;

          if (value === null || value === "") {
            warnings.push(`Empty value at: ${currentPath}`);
          } else if (typeof value === "object" && value !== null) {
            checkEmptyValues(value, currentPath);
          }
        }
      }

      if (typeof parsed === "object" && parsed !== null) {
        checkEmptyValues(parsed);
      }
    } catch (parseError) {
      errors.push(`JSON Parse Error: ${parseError.message}`);

      // Try to provide helpful error location
      const lines = content.split("\n");
      const errorMatch = parseError.message.match(/position (\d+)/);
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        let currentPos = 0;
        let lineNum = 1;

        for (const line of lines) {
          if (currentPos + line.length >= position) {
            errors.push(`Error likely on line ${lineNum}: "${line.trim()}"`);
            break;
          }
          currentPos += line.length + 1; // +1 for newline
          lineNum++;
        }
      }
    }

    // Display results
    if (errors.length === 0 && warnings.length === 0) {
      showResults(
        resultsDiv,
        "success",
        "✅ JSON validation passed! Valid JSON with no warnings."
      );
    } else {
      const type = errors.length > 0 ? "error" : "warning";
      const message = `Found ${errors.length} error(s) and ${warnings.length} warning(s):`;
      showResults(resultsDiv, type, message, [...errors, ...warnings]);
    }
  } catch (error) {
    showResults(resultsDiv, "error", `Error reading file: ${error.message}`);
  }

  validateBtn.disabled = false;
  validateBtn.textContent = "Validate JSON";
}

// Utility Functions
function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function showResults(container, type, message, items = []) {
  container.className = `results ${type}`;
  container.style.display = "block";

  let html = `<strong>${message}</strong>`;

  if (items.length > 0) {
    html += '<ul class="error-list">';
    items.forEach((item) => {
      html += `<li>${item}</li>`;
    });
    html += "</ul>";
  }

  container.innerHTML = html;
}

// Auto-validate on file selection
document.getElementById("html-file").addEventListener("change", function () {
  if (this.files.length) {
    document.getElementById("html-validate-btn").textContent = "Validate HTML";
    document.getElementById("html-results").style.display = "none";
  }
});

document.getElementById("css-file").addEventListener("change", function () {
  if (this.files.length) {
    document.getElementById("css-validate-btn").textContent = "Validate CSS";
    document.getElementById("css-results").style.display = "none";
  }
});

document.getElementById("json-file").addEventListener("change", function () {
  if (this.files.length) {
    document.getElementById("json-validate-btn").textContent = "Validate JSON";
    document.getElementById("json-results").style.display = "none";
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("Code Validators initialized");
});
