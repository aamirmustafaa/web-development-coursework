# Internet History of Pakistan - Handlebars Integration

This project has been enhanced with **Handlebars template engine** for dynamic content rendering and better maintainability.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server
- `npm run validate` - Run project validation
- `npm run serve` - Start static Python server (legacy)

## 📁 Project Structure

### Handlebars Implementation

```
├── server.js                 # Express server with Handlebars setup
├── views/                    # Handlebars templates
│   ├── layouts/
│   │   └── main.hbs         # Main layout template
│   ├── partials/
│   │   └── navigation.hbs   # Navigation component
│   ├── landing.hbs          # Home page template
│   ├── intro.hbs            # Introduction page template
│   ├── evolution.hbs        # Evolution page template
│   ├── impact.hbs           # Impact page template
│   ├── future.hbs           # Future page template
│   └── 404.hbs              # Error page template
├── json/                    # Data files
│   ├── landing-data.json
│   ├── intro.json
│   ├── evolution.json
│   ├── impact.json
│   └── future.json
├── css/                     # Stylesheets
├── js/                      # JavaScript files
└── assets/                  # Images and assets
```

## 🔧 Handlebars Features

### Template Engine Benefits

- **Dynamic Content**: JSON data automatically populates templates
- **Reusable Components**: Navigation and layout shared across pages
- **Maintainable Code**: Separation of content, structure, and style
- **SEO Friendly**: Server-side rendering

### Custom Helpers

- `eq` - Equality comparison for conditional rendering
- `json` - JSON stringification for debugging

### Data Binding

Each page automatically loads its corresponding JSON data:

- `/` → `landing-data.json`
- `/intro` → `intro.json`
- `/evolution` → `evolution.json`
- `/impact` → `impact.json`
- `/future` → `future.json`

## 🌐 Routes

| Route         | Template        | Data Source         | Description                                 |
| ------------- | --------------- | ------------------- | ------------------------------------------- |
| `/`           | `landing.hbs`   | `landing-data.json` | Home page with overview                     |
| `/intro`      | `intro.hbs`     | `intro.json`        | Introduction to Pakistan's internet history |
| `/evolution`  | `evolution.hbs` | `evolution.json`    | Timeline of internet evolution              |
| `/impact`     | `impact.hbs`    | `impact.json`       | Impact on society and economy               |
| `/future`     | `future.hbs`    | `future.json`       | Future projections and trends               |
| `/validators` | Static HTML     | -                   | Code validation tools                       |

## 📝 Template Examples

### Using Data in Templates

```handlebars
<!-- Simple variable -->
<h1>{{hero.title}}</h1>

<!-- Iterating over arrays -->
{{#each navigation.navItems}}
  <a href="{{url}}">{{title}}</a>
{{/each}}

<!-- Conditional rendering -->
{{#if active}}class="active"{{/if}}
```

### Layout Structure

```handlebars
<!-- views/layouts/main.hbs -->
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <link rel="stylesheet" href="/css/{{cssFile}}" />
</head>
<body>
  {{> navigation}}
  {{{body}}}
  <script src="/js/{{jsFile}}"></script>
</body>
</html>
```

## 🔄 Migration from Static HTML

The project has been migrated from static HTML files to dynamic Handlebars templates:

1. **Static HTML** (`html/*.html`) → **Handlebars Templates** (`views/*.hbs`)
2. **Hardcoded Content** → **JSON Data** (`json/*.json`)
3. **Individual Pages** → **Template System** with shared layout
4. **Manual Navigation** → **Dynamic Navigation** from data

## 🛠️ Development Workflow

1. **Modify Content**: Edit JSON files in `/json/` directory
2. **Update Structure**: Modify Handlebars templates in `/views/`
3. **Style Changes**: Update CSS files in `/css/`
4. **Add Features**: Extend `server.js` for new routes/functionality

## 📦 Dependencies

### Production

- `express` - Web framework
- `express-handlebars` - Template engine

### Development

- `nodemon` - Auto-restart server on changes

## 🚦 Benefits of Handlebars Integration

1. **Maintainability**: Single source of truth for content
2. **Scalability**: Easy to add new pages and sections
3. **Consistency**: Shared layouts and components
4. **Performance**: Server-side rendering for faster initial load
5. **SEO**: Search engine friendly markup
6. **Developer Experience**: Hot reloading with nodemon

## 🔧 Customization

### Adding New Pages

1. Create JSON data file in `/json/`
2. Create template in `/views/`
3. Add route in `server.js`
4. Update navigation if needed

### Modifying Existing Pages

1. Update JSON data in corresponding file
2. Modify template structure if needed
3. Server automatically reloads changes

---

**Original Project**: Internet History of Pakistan  
**Enhanced With**: Handlebars Template Engine  
**Author**: Aamir Mustafa  
**Course**: CM1040 Web Development
