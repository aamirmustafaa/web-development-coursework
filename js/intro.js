// Intro page JavaScript functionality

// Configure Nunjucks
nunjucks.configure({ autoescape: true });

async function loadContent() {
  const loading = document.getElementById("loading");
  const target = document.getElementById("intro-content");
  const tpl = document.getElementById("intro-template").innerHTML;

  // Fallback dataset (used if fetch fails)
  const fallback = {
    hero: {
      // Keep only the main headline; the kicker is handled separately in the HTML template.
      headline: "From the First Dial‑Up to the Age of 5G",
    },
    welcome: {
      title: "Welcome to Your Digital Journey",
      paragraphs: [
        "Pakistan's internet story is one of resilience, growth, and transformation. From the first public dial-up connections in the 90s to today's blazing fast 5G trials, it's been a revolutionary ride.",
        "This website offers a deep look at how internet connectivity has reshaped Pakistan’s education, economy, culture, and digital identity.",
        "We highlight historic milestones, analyze current usage trends, and look ahead to future possibilities in connectivity and technology.",
      ],
    },
    highlights: [],
    facts: {
      title: "Did You Know?",
      list: [
        "Pakistan has over 125 million internet users as of 2024.",
        "The country ranks among the top 5 nations for freelance earnings.",
        "Rural mobile broadband coverage has expanded by 50% since 2018.",
        "YouTube is Pakistan’s most visited website after Google.",
        "StormFiber and Nayatel offer up to 1 Gbps speeds in major cities.",
      ],
    },
    cta: {
      headline: "Why This Project Matters",
      points: [
        "The internet isn’t just technology — it's an equalizer. It connects people to education, healthcare, and economic opportunities.",
        "In Pakistan, the web is helping students attend virtual classes, freelancers earn global income, and communities access vital services.",
        "This website documents the history, celebrates the present, and imagines the future of Pakistan’s digital growth.",
      ],
    },
    footer: {
      credits: "Internet in Pakistan Project",
      author: "Created by Aamir Mustafa",
      year: 2025,
    },
  };

  try {
    loading.style.display = "flex";
    target.hidden = true;

    const resp = await fetch("json/intro.json", { cache: "no-store" });
    const data = resp.ok ? await resp.json() : fallback;

    const html = nunjucks.renderString(tpl, data || fallback);
    target.innerHTML = html;

    loading.style.display = "none";
    target.hidden = false;

    // subtle reveal
    applyReveal();
  } catch (e) {
    const html = nunjucks.renderString(tpl, fallback);
    target.innerHTML = html;
    loading.style.display = "none";
    target.hidden = false;
    applyReveal();
    console.warn("Intro JSON failed, using fallback:", e);
  }
}

function applyReveal() {
  const els = document.querySelectorAll(".reveal, .card");
  els.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.transition =
            "opacity .55s ease, transform .55s cubic-bezier(.2,.8,.2,1)";
          en.target.style.opacity = "1";
          en.target.style.transform = "translateY(0)";
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

// Initialize content loading
document.addEventListener("DOMContentLoaded", loadContent);

// Smooth internal links
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  e.preventDefault();
  const tgt = document.querySelector(a.getAttribute("href"));
  if (tgt) tgt.scrollIntoView({ behavior: "smooth", block: "start" });
});
