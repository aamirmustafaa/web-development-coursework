# Internet History of Pakistan - Code Validators

This project includes comprehensive code validation tools for HTML, CSS, and JSON files to ensure code quality and catch errors early.

## 🔧 Validation Tools

### 1. Web-based Validators

Access the interactive validator interface at `/validators/index.html`

- **HTML Validator**: Checks for proper structure, missing tags, accessibility issues
- **CSS Validator**: Validates syntax, checks for best practices, vendor prefixes
- **JSON Validator**: Validates JSON syntax, formatting, and structure

### 2. Command Line Validation

#### Prerequisites

- Node.js installed on your system

#### Commands

```bash
# Validate all files in the project
npm run validate

# Validate only HTML files
npm run validate:html

# Validate only CSS files
npm run validate:css

# Validate only JSON files
npm run validate:json

# Start local development server
npm run serve
npm start
```

#### Manual Validation

```bash
# Run the complete project validator
node validate-project.js
```

## 📋 What Gets Validated

### HTML Validation

- ✅ DOCTYPE declaration
- ✅ Required HTML structure (`<html>`, `<head>`, `<body>`)
- ✅ Meta tags (charset, viewport)
- ✅ Title tag presence
- ✅ Accessibility (alt attributes on images)
- ✅ Semantic HTML usage
- ✅ Tag structure and nesting

### CSS Validation

- ✅ Syntax errors (missing braces, semicolons)
- ✅ Property name validation
- ✅ Vendor prefix best practices
- ✅ CSS best practices (!important usage)
- ✅ Formatting consistency

### JSON Validation

- ✅ Valid JSON syntax
- ✅ Proper formatting and indentation
- ✅ Trailing comma detection
- ✅ Empty value warnings
- ✅ Structure validation

## 🎯 Error Types

### Errors (Must Fix)

- Missing required HTML tags
- CSS syntax errors
- Invalid JSON syntax
- Mismatched braces/brackets

### Warnings (Recommended)

- Missing meta tags
- Accessibility improvements
- Formatting inconsistencies
- Best practice suggestions

## 🚀 Usage Examples

### Web Interface

1. Open `/validators/index.html` in your browser
2. Select a file using the file picker
3. Click "Validate" to see results
4. Review errors and warnings with line numbers

### Command Line

```bash
# Quick validation of all files
npm run validate

# Output example:
🔍 Starting project validation...
Found 4 HTML file(s)
Found 5 CSS file(s)
Found 3 JSON file(s)

📊 Validation Results
==================

🌐 HTML Files:
  📄 index.html
    ✅ No issues found

  📄 html/intro.html
    ⚠️  Warnings:
      • Consider using semantic HTML tags

🎉 All validations passed! No errors found.
```

## 🔍 Integration with Development

### Pre-commit Validation

Add to your development workflow:

```bash
# Before committing changes
npm run validate
```

### IDE Integration

The validators can be integrated with:

- VS Code extensions
- Linting tools
- Build pipelines
- CI/CD workflows

## 📁 File Structure

```
/validators/
├── index.html          # Web-based validator interface
├── /js/
│   └── validators.js   # Client-side validation logic
/js/
├── validators.js       # Shared validation functions
validate-project.js     # Command-line validator
package.json           # NPM scripts and dependencies
```

## 🛠️ Customization

### Adding New Validation Rules

1. Edit `js/validators.js` for web interface
2. Edit `validate-project.js` for command-line tool
3. Add new rules to the respective validation functions

### Custom File Types

Modify the file extension arrays in `validate-project.js`:

```javascript
const htmlFiles = this.findFiles(projectRoot, [".html", ".htm"]);
const cssFiles = this.findFiles(projectRoot, [".css", ".scss"]); // Add SCSS
```

## 🎨 Features

- **Real-time validation** with immediate feedback
- **Line-by-line error reporting** for precise debugging
- **Accessibility checks** for inclusive design
- **Performance suggestions** for optimal loading
- **Cross-platform compatibility** (Windows, Mac, Linux)
- **No external dependencies** for core validation

## 🔗 Quick Links

- [Web Validators Interface](validators/index.html)
- [Project Homepage](index.html)
- [Validation Documentation](#validation-tools)

## 📞 Support

For issues or questions about the validation tools:

1. Check the console output for detailed error messages
2. Review the validation criteria above
3. Use the web interface for visual debugging
4. Run `npm run validate` for comprehensive checks

---

_Validators ensure code quality and help maintain professional standards across the Internet History of Pakistan project._
