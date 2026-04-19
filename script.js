const root = document.documentElement;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const toast = document.querySelector(".toast");
const year = document.querySelector("#year");
const contactForm = document.querySelector("[data-contact-form]");
const repoContainers = [...document.querySelectorAll("[data-github-projects]")];
const previewContainers = [...document.querySelectorAll("[data-github-preview]")];
const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)") || { matches: false };
const finePointerQuery = window.matchMedia?.("(hover: hover) and (pointer: fine)") || { matches: false };

const fallbackRepos = [
  {
    name: "File-Conveter",
    description: "Public HTML project for file conversion experiments.",
    language: "HTML",
    html_url: "https://github.com/swarajfugare/File-Conveter",
    updated_at: "2025-11-09T13:29:35Z"
  },
  {
    name: "SocialHunter",
    description: "Python project focused on social discovery workflows.",
    language: "Python",
    html_url: "https://github.com/swarajfugare/SocialHunter",
    updated_at: "2025-09-07T14:40:03Z"
  },
  {
    name: "CivilBot",
    description: "Civil engineering themed bot project built with web technologies.",
    language: "HTML",
    html_url: "https://github.com/swarajfugare/CivilBot",
    updated_at: "2025-08-22T04:14:03Z"
  },
  {
    name: "Telegram-bot",
    description: "Telegram bot repository.",
    language: "Bot",
    html_url: "https://github.com/swarajfugare/Telegram-bot",
    updated_at: "2024-08-18T04:44:12Z"
  },
  {
    name: "real-time-code-editor",
    description: "Real-time code editor concept repository.",
    language: "Code",
    html_url: "https://github.com/swarajfugare/real-time-code-editor",
    updated_at: "2023-07-30T14:30:25Z"
  },
  {
    name: "swarajfugare",
    description: "Config files for the GitHub profile.",
    language: "HTML",
    html_url: "https://github.com/swarajfugare/swarajfugare",
    updated_at: "2023-05-02T10:39:26Z"
  }
];

let repoLoadStarted = false;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(value));
}

function repoDescription(repo) {
  return repo.description || "Public GitHub repository by Swaraj Fugare.";
}

function repoCard(repo) {
  const name = escapeHtml(repo.name);
  const description = escapeHtml(repoDescription(repo));
  const language = escapeHtml(repo.language || "Code");
  const url = escapeHtml(repo.html_url);

  return `
    <article class="project-card reveal">
      <span class="icon-pill project-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9.4 16.6 4.8 12l4.6-4.6 1.4 1.4L7.6 12l3.2 3.2-1.4 1.4Zm5.2 0-1.4-1.4 3.2-3.2-3.2-3.2 1.4-1.4 4.6 4.6-4.6 4.6Z"/></svg></span>
      <h3>${name}</h3>
      <p>${description}</p>
      <div class="repo-meta">
        <span class="repo-chip">${language}</span>
        <span class="repo-chip">Updated ${formatDate(repo.updated_at)}</span>
      </div>
      <a href="${url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
    </article>
  `;
}

function renderRepos(repos) {
  const sorted = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  repoContainers.forEach((container) => {
    container.innerHTML = sorted.map(repoCard).join("");
  });

  previewContainers.forEach((container) => {
    container.innerHTML = sorted.slice(0, 3).map(repoCard).join("");
  });

  enhanceFlipCards();
  observeReveals();
  initTiltCards();
}

async function loadRepos() {
  if (repoLoadStarted || (!repoContainers.length && !previewContainers.length)) return;

  repoLoadStarted = true;
  renderRepos(fallbackRepos);

  try {
    const response = await fetch("https://api.github.com/users/swarajfugare/repos?sort=updated&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub API request failed");
    const repos = await response.json();
    renderRepos(repos);
  } catch {
    showToast("Showing saved GitHub project data while live GitHub data is unavailable.");
  }
}

function queueRepoLoad() {
  const targets = [...repoContainers, ...previewContainers];
  if (!targets.length) return;

  const firstTarget = targets[0];
  if (!firstTarget) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          loadRepos();
        });
      },
      { rootMargin: "160px 0px" }
    );

    observer.observe(firstTarget);
    return;
  }

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadRepos, { timeout: 1800 });
    return;
  }

  window.setTimeout(loadRepos, 500);
}

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initHeadingAnimation() {
  const headings = document.querySelectorAll("h1");

  headings.forEach((heading) => {
    if (heading.dataset.headingReady === "true") return;

    const text = heading.textContent;
    const fragment = document.createDocumentFragment();

    Array.from(text).forEach((char, index) => {
      const span = document.createElement("span");
      span.className = char === " " ? "heading-char is-space" : "heading-char";
      span.style.setProperty("--char-index", String(index));
      span.textContent = char === " " ? "\u00a0" : char;
      fragment.append(span);
    });

    heading.textContent = "";
    heading.setAttribute("aria-label", text);
    heading.append(fragment);
    heading.dataset.headingReady = "true";
  });
}

function enhanceFlipCards() {
  const cards = document.querySelectorAll(".card, .business-card, .project-card");

  cards.forEach((card, index) => {
    if (card.dataset.flipReady === "true") return;

    const icon = card.querySelector(":scope > .icon-pill");
    const title = card.querySelector(":scope > h3");
    const description = card.querySelector(":scope > p");
    if (!icon || !title || !description) return;

    const remainingContent = [...card.childNodes].filter((node) => node !== icon && node !== title);
    const subtitle = description.cloneNode(true);
    subtitle.classList.add("card-subtitle");
    subtitle.setAttribute("aria-hidden", "true");

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-face card-front";

    const back = document.createElement("div");
    back.className = "card-face card-back";

    front.append(icon, title, subtitle);
    remainingContent.forEach((node) => back.append(node));
    inner.append(front, back);
    card.append(inner);

    card.classList.add("is-flip-ready");
    card.dataset.flipReady = "true";
    card.style.setProperty("--float-order", String(index % 8));
  });
}

function supportsInteractiveMotion() {
  return finePointerQuery.matches && !motionQuery.matches;
}

function resetTilt(item) {
  item.style.removeProperty("--tilt-x");
  item.style.removeProperty("--tilt-y");
  item.style.removeProperty("--shine-x");
  item.style.removeProperty("--shine-y");
  item.style.removeProperty("--magnet-x");
  item.style.removeProperty("--magnet-y");
}

function initTiltCards() {
  if (!supportsInteractiveMotion()) return;

  const tiltItems = document.querySelectorAll(
    [
      ".profile-card",
      ".business-hero-card",
      ".resume-preview",
      ".letter-card",
      ".contact-panel",
      ".social-card",
      ".stat",
      ".contact-list a",
      ".proof-list div",
      ".card",
      ".business-card",
      ".project-card",
      ".btn",
      ".pill-link",
      ".social-row a"
    ].join(", ")
  );

  tiltItems.forEach((item) => {
    if (item.dataset.tiltBound === "true") return;
    item.dataset.tiltBound = "true";

    item.addEventListener(
      "pointermove",
      (event) => {
        if (!supportsInteractiveMotion()) return;

        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const maxTilt = item.matches(".profile-card, .business-hero-card, .resume-preview") ? 7 : 5.5;

        item.style.setProperty("--tilt-x", `${(-y * maxTilt).toFixed(2)}deg`);
        item.style.setProperty("--tilt-y", `${(x * maxTilt).toFixed(2)}deg`);
        item.style.setProperty("--shine-x", `${(50 + x * 42).toFixed(1)}%`);
        item.style.setProperty("--shine-y", `${(50 + y * 42).toFixed(1)}%`);
      },
      { passive: true }
    );

    item.addEventListener("pointerleave", () => resetTilt(item), { passive: true });
    item.addEventListener("blur", () => resetTilt(item), true);
  });
}

function initSpotlight() {
  if (motionQuery.matches) return;

  let frame = 0;
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 3;

  const update = () => {
    frame = 0;
    root.style.setProperty("--spotlight-x", `${x.toFixed(0)}px`);
    root.style.setProperty("--spotlight-y", `${y.toFixed(0)}px`);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    },
    { passive: true }
  );
}

function initMagneticButtons() {
  if (!supportsInteractiveMotion()) return;

  document.querySelectorAll(".btn").forEach((button) => {
    if (button.dataset.magnetBound === "true") return;
    button.dataset.magnetBound = "true";

    button.addEventListener(
      "pointermove",
      (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        button.style.setProperty("--magnet-x", `${(x * 8).toFixed(2)}px`);
        button.style.setProperty("--magnet-y", `${(y * 6).toFixed(2)}px`);
      },
      { passive: true }
    );

    button.addEventListener("pointerleave", () => resetTilt(button), { passive: true });
  });
}

function resetHeroMotion(hero) {
  hero.style.removeProperty("--hero-bg-x");
  hero.style.removeProperty("--hero-bg-y");
  hero.style.removeProperty("--hero-media-x");
  hero.style.removeProperty("--hero-media-y");
  hero.style.removeProperty("--hero-rotate-x");
  hero.style.removeProperty("--hero-rotate-y");
}

function initHeroParallax() {
  const heroSections = document.querySelectorAll(".hero, .page-hero");
  if (!heroSections.length || !supportsInteractiveMotion()) return;

  heroSections.forEach((hero) => {
    if (hero.dataset.parallaxBound === "true") return;
    hero.dataset.parallaxBound = "true";

    hero.addEventListener(
      "pointermove",
      (event) => {
        if (!supportsInteractiveMotion()) return;

        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        hero.style.setProperty("--hero-bg-x", `${(-x * 18).toFixed(1)}px`);
        hero.style.setProperty("--hero-bg-y", `${(-y * 14).toFixed(1)}px`);
        hero.style.setProperty("--hero-media-x", `${(x * 12).toFixed(1)}px`);
        hero.style.setProperty("--hero-media-y", `${(y * 10).toFixed(1)}px`);
        hero.style.setProperty("--hero-rotate-x", `${(-y * 2.4).toFixed(2)}deg`);
        hero.style.setProperty("--hero-rotate-y", `${(x * 2.8).toFixed(2)}deg`);
      },
      { passive: true }
    );

    hero.addEventListener("pointerleave", () => resetHeroMotion(hero), { passive: true });
  });
}

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

function closeNav() {
  navPanel?.classList.remove("is-open");
  navToggle?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function initNavigation() {
  navToggle?.addEventListener("click", () => {
    const isOpen = navPanel?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  document.querySelectorAll(".nav-panel a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });
}

function initContactForm() {
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const message = formData.get("message") || "";
    const host = window.location.hostname;
    const canUseNetlify =
      host.includes("netlify.app") ||
      (!host.includes("github.io") && host !== "localhost" && host !== "127.0.0.1" && host !== "");

    if (canUseNetlify) {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          contactForm.reset();
          showToast("Message sent. You can view it in Netlify Forms for this site.");
        })
        .catch(() => {
          showToast("Form service unavailable. Opening email instead.");
          const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
          const bodyText = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
          window.location.href = `mailto:swarajfugare23@gmail.com?subject=${subject}&body=${bodyText}`;
        });
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const bodyText = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:swarajfugare23@gmail.com?subject=${subject}&body=${bodyText}`;
    showToast("Opening your email app. Local static previews cannot store form submissions.");
  });
}

function initApp() {
  root.dataset.theme = "dark";
  if (year) year.textContent = String(new Date().getFullYear());
  updateHeaderState();
  enhanceFlipCards();
  initHeadingAnimation();
  observeReveals();
  initNavigation();
  initContactForm();
  initSpotlight();
  initHeroParallax();
  initTiltCards();
  initMagneticButtons();
  queueRepoLoad();
}

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("load", observeReveals);
document.addEventListener("DOMContentLoaded", initApp);
