// Evolution page JavaScript functionality

// Configure Nunjucks
nunjucks.configure({ autoescape: true });

async function loadContent() {
  const loading = document.getElementById("loading");
  const target = document.getElementById("timeline-content");
  const tpl = document.getElementById("timeline-template").innerHTML;

  // Fallback dataset (used if fetch fails)
  const fallback = {
    title: "Internet Evolution in Pakistan (1995–2025)",
    introduction: [
      "From public internet launch to nationwide mobile broadband, explore the milestones that shaped Pakistan's digital landscape.",
      "Scroll to see key moments across infrastructure, policy, platforms and people.",
    ],
    timeline: [
      {
        year: "1995",
        title: "Public Internet Launch",
        description:
          "First commercial access; universities and ISPs enable email and early web connectivity.",
      },
      {
        year: "2006",
        title: "DSL Era Begins",
        description:
          "Fixed-line broadband rolls out in major cities; internet cafés start to decline.",
      },
      {
        year: "2014",
        title: "3G/4G Spectrum Auction",
        description:
          "Mobile broadband ignites mass adoption; data usage skyrockets.",
      },
      {
        year: "2020",
        title: "Platform Regulations",
        description:
          "Content moderation and compliance debates shape the user experience.",
      },
      {
        year: "2023",
        title: "Early 5G Trials",
        description:
          "Pilot deployments test new use cases and network capabilities.",
      },
      {
        year: "2025",
        title: "Last‑Mile Fiber Push",
        description:
          "FTTH/FTTB expands in urban cores; new policies aim to narrow the access gap.",
      },
    ],
    footer: {
      credits: "CM1040 Web Development — Internet in Pakistan",
      author: "Created by Aamir Mustafa · Goldsmiths, University of London",
      year: "© 2025",
    },
  };

  try {
    loading.hidden = false;
    target.hidden = true;

    const resp = await fetch("../json/evolution.json", { cache: "no-store" });
    const data = resp.ok ? await resp.json() : fallback;

    // Debug logging
    console.log("Response OK:", resp.ok);
    console.log(
      "Timeline items loaded:",
      data.timeline ? data.timeline.length : "no timeline"
    );
    console.log("Data source:", resp.ok ? "JSON file" : "fallback");

    const html = nunjucks.renderString(tpl, data || fallback);
    target.innerHTML = html;

    target.hidden = false;
    loading.remove(); // <- ensure spinner is gone

    initTimelineAnimations();
    initScrollProgress();
    initKeyboardNav();
  } catch (e) {
    // Fallback render
    console.log("Error loading JSON, using fallback:", e);
    console.log("Fallback timeline items:", fallback.timeline.length);
    const html = nunjucks.renderString(tpl, fallback);
    target.innerHTML = html;

    target.hidden = false;
    loading.remove(); // <- ensure spinner is gone

    initTimelineAnimations();
    initScrollProgress();
    initKeyboardNav();
    console.warn("evolution.json failed, using fallback:", e);
  }
}

function initTimelineAnimations() {
  const items = document.querySelectorAll(".timeline-item");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add("animate"), i * 90);
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -80px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initScrollProgress() {
  const bar = document.getElementById("progress-bar");
  const update = () => {
    const max = document.body.scrollHeight - innerHeight;
    bar.style.width = Math.max(0, (pageYOffset / (max || 1)) * 100) + "%";
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  update();
}

function initKeyboardNav() {
  document.addEventListener("keydown", (e) => {
    const cur = document.activeElement;
    if (!cur || !cur.classList.contains("timeline-content")) return;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = cur.closest(".timeline-item")?.nextElementSibling;
      next?.querySelector(".timeline-content")?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = cur.closest(".timeline-item")?.previousElementSibling;
      prev?.querySelector(".timeline-content")?.focus();
    }
  });
}

// Initialize content loading
document.addEventListener("DOMContentLoaded", loadContent);

// Smooth internal links
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href^='#']");
  if (!a) return;
  e.preventDefault();
  document
    .querySelector(a.getAttribute("href"))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
});
