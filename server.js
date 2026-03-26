const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    defaultLayout: "main",
    helpers: {
      eq: (a, b) => a === b,
      json: (context) => JSON.stringify(context),
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Helper function to load JSON data
function loadJsonData(filename) {
  try {
    const filePath = path.join(__dirname, "json", filename);
    const rawData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return {};
  }
}

// Routes
app.get("/", (req, res) => {
  const data = loadJsonData("landing-data.json");
  res.render("landing", {
    title: "Internet History of Pakistan",
    cssFile: "landing-style.css",
    jsFile: "landing-script.js",
    ...data,
  });
});

app.get("/intro", (req, res) => {
  const data = loadJsonData("intro.json");
  res.render("intro", {
    title: "Introduction - Internet History of Pakistan",
    cssFile: "intro.css",
    jsFile: "intro.js",
    ...data,
  });
});

app.get("/evolution", (req, res) => {
  const data = loadJsonData("evolution.json");
  res.render("evolution", {
    title: "Evolution - Internet History of Pakistan",
    cssFile: "evolution.css",
    jsFile: "evolution.js",
    ...data,
  });
});

app.get("/impact", (req, res) => {
  const data = loadJsonData("impact.json");
  res.render("impact", {
    title: "Impact - Internet History of Pakistan",
    cssFile: "impact.css",
    jsFile: "impact.js",
    ...data,
  });
});

app.get("/future", (req, res) => {
  const data = loadJsonData("future.json");
  res.render("future", {
    title: "Future - Internet History of Pakistan",
    cssFile: "future.css",
    jsFile: "future.js",
    ...data,
  });
});

// Validators route (serve static HTML)
app.get("/validators", (req, res) => {
  res.sendFile(path.join(__dirname, "validators", "index.html"));
});

// Error handling
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("  - / (Landing page)");
  console.log("  - /intro (Introduction)");
  console.log("  - /evolution (Evolution)");
  console.log("  - /impact (Impact)");
  console.log("  - /future (Future)");
  console.log("  - /validators (Code validators)");
});
