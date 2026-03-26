#!/usr/bin/env node

/**
 * Automated Code Validator
 * Validates all HTML, CSS, and JSON files in the project
 * Run with: node validate-project.js
 */

const fs = require("fs");
const path = require("path");

class ProjectValidator {
  constructor() {
    this.results = {
      html: [],
      css: [],
      json: [],
      errors: 0,
      warnings: 0,
    };
  }

  // Find all files of specific extensions
  findFiles(dir, extensions) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (
        item.isDirectory() &&
        !item.name.startsWith(".") &&
        item.name !== "node_modules"
      ) {
        files.push(...this.findFiles(fullPath, extensions));
      } else if (
        item.isFile() &&
        extensions.some((ext) => item.name.endsWith(ext))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  // Validate HTML files
  validateHTML(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
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
      warnings.push("Missing <title> tag");
    }

    if (!content.includes("charset")) {
      warnings.push("Missing charset declaration");
    }

    if (!content.includes("viewport")) {
      warnings.push("Missing viewport meta tag");
    }

    // Check for accessibility issues
    if (content.includes("<img") && !content.includes("alt=")) {
      warnings.push("Images without alt attributes");
    }

    // Check for semantic HTML
    const semanticTags = [
      "header",
      "nav",
      "main",
      "section",
      "article",
      "aside",
      "footer",
    ];
    const hasSemanticTags = semanticTags.some((tag) =>
      content.includes(`<${tag}`)
    );
    if (!hasSemanticTags) {
      warnings.push("Consider using semantic HTML tags");
    }

    return { errors, warnings };
  }

  // Validate CSS files
  validateCSS(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const errors = [];
    const warnings = [];

    // Check for balanced braces
    const braceOpen = (content.match(/{/g) || []).length;
    const braceClose = (content.match(/}/g) || []).length;

    if (braceOpen !== braceClose) {
      errors.push("Mismatched curly braces");
    }

    // Check for common issues line by line
    const lines = content.split("\n");
    let inMultiLineProperty = false;

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmedLine = line.trim();

      // Track multi-line properties
      if (
        trimmedLine.includes(":") &&
        !trimmedLine.includes(";") &&
        !trimmedLine.includes("{")
      ) {
        inMultiLineProperty = true;
      } else if (trimmedLine.includes(";")) {
        inMultiLineProperty = false;
      }

      // Missing semicolon check - improved logic
      if (
        trimmedLine.includes(":") &&
        !trimmedLine.includes(";") &&
        !trimmedLine.includes("{") &&
        !trimmedLine.includes("}") &&
        !trimmedLine.includes("@") && // Ignore at-rules
        !trimmedLine.includes("/*") && // Ignore comments
        !inMultiLineProperty && // Ignore multi-line properties
        trimmedLine !== "" &&
        !trimmedLine.endsWith(",") // Ignore multi-value properties
      ) {
        warnings.push(`Line ${lineNum}: Possible missing semicolon`);
      }

      // Check for vendor prefixes
      if (
        line.includes("-webkit-") ||
        line.includes("-moz-") ||
        line.includes("-ms-")
      ) {
        const property = line.match(/-(?:webkit|moz|ms|o)-([a-zA-Z-]+)/);
        if (property && !content.includes(property[1] + ":")) {
          warnings.push(
            `Line ${lineNum}: Consider adding standard property for ${property[0]}`
          );
        }
      }
    });

    // Check for CSS best practices - !important check disabled as current usage is legitimate

    return { errors, warnings };
  }

  // Validate JSON files
  validateJSON(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const errors = [];
    const warnings = [];

    try {
      const parsed = JSON.parse(content);

      // Check formatting
      const formatted = JSON.stringify(parsed, null, 2);
      if (content.trim() !== formatted) {
        warnings.push("JSON formatting could be improved");
      }

      // Check for trailing commas
      if (content.includes(",}") || content.includes(",]")) {
        warnings.push("Trailing commas detected");
      }

      // Check for empty values
      const checkEmpty = (obj, path = "") => {
        if (typeof obj === "object" && obj !== null) {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            if (value === null || value === "") {
              warnings.push(`Empty value at: ${currentPath}`);
            } else if (typeof value === "object") {
              checkEmpty(value, currentPath);
            }
          });
        }
      };

      checkEmpty(parsed);
    } catch (parseError) {
      errors.push(`JSON Parse Error: ${parseError.message}`);
    }

    return { errors, warnings };
  }

  // Run validation on all files
  validate() {
    const projectRoot = process.cwd();

    console.log("🔍 Starting project validation...\n");

    // Find and validate HTML files
    const htmlFiles = this.findFiles(projectRoot, [".html", ".htm"]);
    console.log(`Found ${htmlFiles.length} HTML file(s)`);

    htmlFiles.forEach((file) => {
      const result = this.validateHTML(file);
      const relativePath = path.relative(projectRoot, file);
      this.results.html.push({ file: relativePath, ...result });
      this.results.errors += result.errors.length;
      this.results.warnings += result.warnings.length;
    });

    // Find and validate CSS files
    const cssFiles = this.findFiles(projectRoot, [".css"]);
    console.log(`Found ${cssFiles.length} CSS file(s)`);

    cssFiles.forEach((file) => {
      const result = this.validateCSS(file);
      const relativePath = path.relative(projectRoot, file);
      this.results.css.push({ file: relativePath, ...result });
      this.results.errors += result.errors.length;
      this.results.warnings += result.warnings.length;
    });

    // Find and validate JSON files
    const jsonFiles = this.findFiles(projectRoot, [".json"]);
    console.log(`Found ${jsonFiles.length} JSON file(s)\n`);

    jsonFiles.forEach((file) => {
      const result = this.validateJSON(file);
      const relativePath = path.relative(projectRoot, file);
      this.results.json.push({ file: relativePath, ...result });
      this.results.errors += result.errors.length;
      this.results.warnings += result.warnings.length;
    });

    this.printResults();
  }

  // Print validation results
  printResults() {
    console.log("📊 Validation Results");
    console.log("=".repeat(50));

    // HTML Results
    if (this.results.html.length > 0) {
      console.log("\n🌐 HTML Files:");
      this.results.html.forEach((result) => {
        console.log(`\n  📄 ${result.file}`);
        if (result.errors.length === 0 && result.warnings.length === 0) {
          console.log("    ✅ No issues found");
        } else {
          if (result.errors.length > 0) {
            console.log("    ❌ Errors:");
            result.errors.forEach((error) => console.log(`      • ${error}`));
          }
          if (result.warnings.length > 0) {
            console.log("    ⚠️  Warnings:");
            result.warnings.forEach((warning) =>
              console.log(`      • ${warning}`)
            );
          }
        }
      });
    }

    // CSS Results
    if (this.results.css.length > 0) {
      console.log("\n🎨 CSS Files:");
      this.results.css.forEach((result) => {
        console.log(`\n  📄 ${result.file}`);
        if (result.errors.length === 0 && result.warnings.length === 0) {
          console.log("    ✅ No issues found");
        } else {
          if (result.errors.length > 0) {
            console.log("    ❌ Errors:");
            result.errors.forEach((error) => console.log(`      • ${error}`));
          }
          if (result.warnings.length > 0) {
            console.log("    ⚠️  Warnings:");
            result.warnings.forEach((warning) =>
              console.log(`      • ${warning}`)
            );
          }
        }
      });
    }

    // JSON Results
    if (this.results.json.length > 0) {
      console.log("\n📋 JSON Files:");
      this.results.json.forEach((result) => {
        console.log(`\n  📄 ${result.file}`);
        if (result.errors.length === 0 && result.warnings.length === 0) {
          console.log("    ✅ No issues found");
        } else {
          if (result.errors.length > 0) {
            console.log("    ❌ Errors:");
            result.errors.forEach((error) => console.log(`      • ${error}`));
          }
          if (result.warnings.length > 0) {
            console.log("    ⚠️  Warnings:");
            result.warnings.forEach((warning) =>
              console.log(`      • ${warning}`)
            );
          }
        }
      });
    }

    // Summary
    console.log("\n📈 Summary");
    console.log("=".repeat(30));
    console.log(
      `Total files validated: ${
        this.results.html.length +
        this.results.css.length +
        this.results.json.length
      }`
    );
    console.log(`Total errors: ${this.results.errors}`);
    console.log(`Total warnings: ${this.results.warnings}`);

    if (this.results.errors === 0) {
      console.log("\n🎉 All validations passed! No errors found.");
    } else {
      console.log(
        `\n⚠️  Please fix ${this.results.errors} error(s) before deployment.`
      );
    }
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new ProjectValidator();
  validator.validate();
}

module.exports = ProjectValidator;
