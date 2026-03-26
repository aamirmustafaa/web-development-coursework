// Render the page with JSON (or fallback) using Nunjucks
nunjucks.configure({ autoescape: true });

async function boot() {
  const loading = document.getElementById("loading");
  const root = document.getElementById("impact-root");
  const tpl = document.getElementById("impact-tpl").innerHTML;

  const fallback = {
    stats: [
      { value: "130M", caption: "Internet Users" },
      { value: "#4", caption: "Global Freelancing Rank" },
      { value: "40%", caption: "Urban Fiber Coverage" },
      { value: "80%", caption: "Mobile Internet Users" },
    ],
    pillars: [
      {
        title: "Economy & Work",
        text: "E‑commerce, gig income and export services create new jobs while lowering entry barriers.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Education & Skills",
        text: "LMS platforms, MOOCs and blended models broaden access to learning.",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Culture & Community",
        text: "Social platforms connect voices across cities; video, music and film dialogue across identities.",
        image:
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Civic Life & Services",
        text: "E‑governance, utility apps and tele‑health shorten time for everyday tasks.",
        image:
          "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Inclusion & Access",
        text: "Digital rails unlock remote work; affordability initiatives bring more people online.",
        image:
          "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Safety & Rights",
        text: "Digital rights advocacy responds to privacy, security and expression concerns.",
        image:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    cases: [
      {
        title: "Freelance boom across second‑tier cities",
        badges: ["Service", "Export", "Upwork"],
        text: "Low entry costs + platforms created remote earning for designers, devs and translators beyond major hubs.",
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Ed‑tech for underserved learners",
        badges: ["Education", "Access"],
        text: "Recorded lessons, WhatsApp micro learning and LMS pilots helped students bridge gaps during outages and closures.",
        image:
          "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Small merchants go online",
        badges: ["E-commerce", "SME"],
        text: "Marketplaces and POS apps enabled payments, inventory and delivery without heavy capex.",
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
      },
    ],
  };

  try {
    const resp = await fetch("../json/impact.json", { cache: "no-store" });
    const data = resp.ok ? await resp.json() : fallback;
    console.log(
      "Impact data loaded:",
      data.pillars[0].image ? "with images" : "without images"
    );
    root.innerHTML = nunjucks.renderString(tpl, data);
  } catch (e) {
    root.innerHTML = nunjucks.renderString(tpl, fallback);
    console.warn("Using fallback data", e);
  } finally {
    loading.style.display = "none";
    root.hidden = false;
  }
}
document.addEventListener("DOMContentLoaded", boot);
