/*
  Landing page script with Handlebars template engine integration.
  Loads data from JSON and renders templates dynamically.
*/

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load data from JSON file
    const response = await fetch("json/landing-data.json");
    const data = await response.json();

    // Initialize Handlebars templates
    initializeTemplates(data);

    // Apply smooth scrolling for all anchor links pointing to on‑page IDs
    document.querySelectorAll(".nav-links a, .btn").forEach((link) => {
      link.addEventListener("click", (ev) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const target = document.querySelector(href);
          if (target) {
            ev.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    // Add dynamic content updates if needed
    updateDynamicContent(data);

    // Add visual indicator that Handlebars is active
    addHandlebarsIndicator();
  } catch (error) {
    console.error("Error loading landing page data:", error);
    // Fallback to static content if JSON loading fails
  }
});

function initializeTemplates(data) {
  // Compile Handlebars templates
  const navigationTemplate = Handlebars.compile(
    document.getElementById("navigation-template").innerHTML
  );
  const heroTemplate = Handlebars.compile(
    document.getElementById("hero-template").innerHTML
  );
  const cardTemplate = Handlebars.compile(
    document.getElementById("card-template").innerHTML
  );

  // Store compiled templates globally for potential use
  window.handlebarsTemplates = {
    navigation: navigationTemplate,
    hero: heroTemplate,
    cards: cardTemplate,
  };

  console.log("Handlebars templates initialized successfully");
}

function updateDynamicContent(data) {
  // Update hero section dynamically
  if (data.hero && window.handlebarsTemplates) {
    const heroContainer = document.querySelector(".hero");
    if (heroContainer) {
      heroContainer.innerHTML = window.handlebarsTemplates.hero(data.hero);
      console.log("Hero section rendered with Handlebars");
    }
  }

  // Update cards section dynamically
  if (data.explore && window.handlebarsTemplates) {
    const cardsContainer = document.querySelector(".cards");
    if (cardsContainer) {
      cardsContainer.innerHTML = window.handlebarsTemplates.cards(data.explore);
      console.log("Cards section rendered with Handlebars");
    }
  }

  // Update navigation dynamically (optional)
  if (data.navigation && window.handlebarsTemplates) {
    const navContainer = document.querySelector(".nav-links");
    if (navContainer) {
      navContainer.innerHTML = window.handlebarsTemplates.navigation(
        data.navigation
      );
      console.log("Navigation rendered with Handlebars");
    }
  }
}

// Handlebars helper functions
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("or", function (a, b) {
  return a || b;
});

// Add visual indicator that Handlebars is working
function addHandlebarsIndicator() {
  // Create a small badge to show Handlebars is active
  const indicator = document.createElement("div");
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #60a5fa;
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(96, 165, 250, 0.3);
    animation: fadeIn 1s ease-in;
  `;
  indicator.textContent = "🔧 Handlebars Active";
  indicator.title = "This page is using Handlebars template engine";

  document.body.appendChild(indicator);

  // Remove after 5 seconds
  setTimeout(() => {
    indicator.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => indicator.remove(), 500);
  }, 5000);

  // Add CSS animation
  if (!document.querySelector("#handlebars-indicator-styles")) {
    const style = document.createElement("style");
    style.id = "handlebars-indicator-styles";
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);
  }
}
