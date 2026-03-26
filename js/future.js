/*
 * future.js – loads content from future.json, populates the DOM and
 * attaches interactive behaviours such as mobile navigation toggling and
 * scroll‑triggered animations. All actions wait until the DOM content
 * is fully loaded.
 */

document.addEventListener("DOMContentLoaded", () => {
  /*
   * Attempt to fetch the external JSON file. If the request fails (for
   * example, when running via the file:// protocol where fetch of local
   * resources may be blocked), fall back to the embedded data defined
   * below. This guarantees that content appears regardless of the
   * environment the user opens the page in.
   */
  fetch("json/future.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network error");
      return response.json();
    })
    .then((data) => populateContent(data))
    .catch(() => {
      // Fallback to embedded data if fetch fails
      populateContent(fallbackData);
    });

  // Mobile navigation toggle
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Close navigation when clicking a link on small screens
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
      }
    });
  });

  // IntersectionObserver to fade in sections on scroll
  const observerOptions = {
    threshold: 0.2,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  // Observe each section
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });
});

/*
 * Embedded fallback data replicates the contents of future.json. This
 * constant is used when fetch fails due to cross‑origin restrictions on
 * file:// URLs. The structure mirrors the JSON file exactly.
 */
const fallbackData = {
  hero: {
    title: "Where Pakistan’s Internet Is Headed",
    subtitle:
      "5G, fiber, AI and rights frameworks will shape the next decade of participation and growth.",
  },
  signals: {
    smallHeader: "Forecasts",
    title: "Signals & Projections (2026–2030)",
    desc: "Conservative estimates based on regional trends and current baselines.",
    items: [
      { value: "+40%", label: "Broadband subscriptions" },
      { value: "70%", label: "4G/5G share of traffic" },
      { value: "+2×", label: "Fiber route‑km" },
      { value: "$3–5B", label: "Digital exports/yr" },
    ],
  },
  tracks: {
    smallHeader: "Tracks",
    title: "Key Tracks To Unlock Value",
    desc: "Execution across infrastructure, capability.",
    items: [
      {
        title: "Nationwide fiber & IXPs",
        desc: "Last mile fiber in metros & shared backhaul to tier 2 cities; local peering to lower latency.",
      },
      {
        title: "5G standalone pilots",
        desc: "Campus networks, FWA for SMEs and industrial IoT sandboxes in ports and SEZs.",
      },
      {
        title: "AI for public services",
        desc: "Voice bots for citizen services, OCR for records, and AI triage in tele health.",
      },
      {
        title: "Fintech & open payments",
        desc: "Interoperable rails, QR ubiquity and SME credit scoring to lift digital commerce.",
      },
      {
        title: "Skills & startup pipeline",
        desc: "National micro‑credentials, cloud credits and working near campuses.",
      },
      {
        title: "Rights & safety by design",
        desc: "Transparent content rules, due process and data protection to build trust.",
      },
    ],
  },
  futures: {
    smallHeader: "Possible Future",
    title: "Three Plausible Futures",
    desc: "Direction hinges on spectrum policy, investment and rights guarantees.",
    items: [
      {
        title: "Green sprint",
        desc: "Co‑ordinated spectrum + fiber capex, exports 11% GDP, costs fall; inclusion expands.",
      },
      {
        title: "Patchy progress",
        desc: "Selective metros thrive; second‑tier cities lag; affordability pressure persists.",
      },
      {
        title: "Stalled momentum",
        desc: "Regulatory risks delays 5G/fiber; talent churn rises; platforms de‑prioritize market.",
      },
    ],
  },
  roadmap: {
    smallHeader: "Road Map",
    title: "Near‑term Roadmap",
    desc: "Milestones any coalition (public, private, civil society) can rally around.",
    years: {
      2025: [
        {
          title: "Spectrum & peering",
          desc: "Finalize spectrum roadmap; expand IXPs in Karachi/Lahore/Islamabad.",
        },
      ],
      2026: [
        {
          title: "Fiber densification",
          desc: "Duct sharing policies; metro last‑mile pilots; open‑access wholesale.",
        },
      ],
      2027: [
        {
          title: "Campus networks",
          desc: "Campus networks in SEZs and ports; FWA for SME corridors.",
        },
      ],
      2028: [
        {
          title: "Gig tech at scale",
          desc: "AI‑assisted services; one‑stop citizen portals; data registries.",
        },
      ],
    },
  },
  guardrails: {
    smallHeader: "Guardrails",
    title: "Key Risks & Mitigations",
    desc: "Build guardrails early to maintain trust and investment.",
    items: [
      {
        title: "Affordability squeeze",
        desc: "Device financing and targeted data subsidies; promote competition.",
      },
      {
        title: "Data protection gaps",
        desc: "Pass + enforce DPA with independent oversight and breach notification.",
      },
      {
        title: "Platform volatility",
        desc: "Interoperable rails and local caching; predictable, consultative rule.",
      },
      {
        title: "Skills shortage",
        desc: "Micro‑credentials tied to employer demand; remote‑work infrastructure.",
      },
    ],
  },
  cta: {
    text: "Ready to shape the next decade? See how today's choices in policy and infrastructure ripple across jobs, services and rights.",
  },
  footer: {
    course: "CMI040 Web Development — Internet in Pakistan",
    creator:
      "Created by Amir Mustafa — Goldsmiths, University of London © 2025",
  },
};

/**
 * Populates the DOM elements with text and repeated structures based on
 * the provided JSON data. This function constructs card elements and
 * timeline items dynamically.
 *
 * @param {Object} data - The parsed JSON data object
 */
function populateContent(data) {
  // Hero section
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  heroTitle.textContent = data.hero.title;
  heroSubtitle.textContent = data.hero.subtitle;

  // Signals section
  document.querySelector(".signals-small").textContent =
    data.signals.smallHeader;
  document.querySelector(".signals-title").textContent = data.signals.title;
  document.querySelector(".signals-desc").textContent = data.signals.desc;
  const signalsGrid = document.querySelector(".signals-grid");
  data.signals.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const value = document.createElement("div");
    value.classList.add("signal-value");
    value.textContent = item.value;
    const label = document.createElement("div");
    label.classList.add("signal-label");
    label.textContent = item.label;
    card.appendChild(value);
    card.appendChild(label);
    signalsGrid.appendChild(card);
  });

  // Tracks section
  document.querySelector(".tracks-small").textContent = data.tracks.smallHeader;
  document.querySelector(".tracks-title").textContent = data.tracks.title;
  document.querySelector(".tracks-desc").textContent = data.tracks.desc;
  const tracksGrid = document.querySelector(".tracks-grid");
  data.tracks.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title;
    const desc = document.createElement("div");
    desc.classList.add("card-desc");
    desc.textContent = item.desc;
    card.appendChild(title);
    card.appendChild(desc);
    tracksGrid.appendChild(card);
  });

  // Futures section
  document.querySelector(".futures-small").textContent =
    data.futures.smallHeader;
  document.querySelector(".futures-title").textContent = data.futures.title;
  document.querySelector(".futures-desc").textContent = data.futures.desc;
  const futuresGrid = document.querySelector(".futures-grid");
  data.futures.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title;
    const desc = document.createElement("div");
    desc.classList.add("card-desc");
    desc.textContent = item.desc;
    card.appendChild(title);
    card.appendChild(desc);
    futuresGrid.appendChild(card);
  });

  // Roadmap section
  document.querySelector(".roadmap-small").textContent =
    data.roadmap.smallHeader;
  document.querySelector(".roadmap-title").textContent = data.roadmap.title;
  document.querySelector(".roadmap-desc").textContent = data.roadmap.desc;
  const timeline = document.querySelector(".timeline");
  // Loop through years in sorted order
  Object.keys(data.roadmap.years)
    .sort()
    .forEach((year) => {
      const entries = data.roadmap.years[year];
      entries.forEach((entry) => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");
        const y = document.createElement("div");
        y.classList.add("timeline-year");
        y.textContent = year;
        const title = document.createElement("div");
        title.classList.add("timeline-title");
        title.textContent = entry.title;
        const desc = document.createElement("div");
        desc.classList.add("timeline-desc");
        desc.textContent = entry.desc;
        item.appendChild(y);
        item.appendChild(title);
        item.appendChild(desc);
        timeline.appendChild(item);
      });
    });

  // Guardrails section
  document.querySelector(".guardrails-small").textContent =
    data.guardrails.smallHeader;
  document.querySelector(".guardrails-title").textContent =
    data.guardrails.title;
  document.querySelector(".guardrails-desc").textContent = data.guardrails.desc;
  const guardrailsGrid = document.querySelector(".guardrails-grid");
  data.guardrails.items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = item.title;
    const desc = document.createElement("div");
    desc.classList.add("card-desc");
    desc.textContent = item.desc;
    card.appendChild(title);
    card.appendChild(desc);
    guardrailsGrid.appendChild(card);
  });

  // CTA and footer
  document.querySelector(".cta-text").textContent = data.cta.text;
  document.querySelector(".footer-course").textContent = data.footer.course;
  document.querySelector(".footer-creator").textContent = data.footer.creator;
}
