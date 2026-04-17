const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const toast = document.querySelector(".toast");
const year = document.querySelector("#year");
const contactForm = document.querySelector("[data-contact-form]");
const repoContainers = document.querySelectorAll("[data-github-projects]");
const previewContainers = document.querySelectorAll("[data-github-preview]");

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

const storedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  if (themeLabel) themeLabel.textContent = isDark ? "Light" : "Dark";
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
  const language = repo.language || "Code";
  return `
    <article class="project-card reveal">
      <h3>${repo.name}</h3>
      <p>${repoDescription(repo)}</p>
      <div class="repo-meta">
        <span class="repo-chip">${language}</span>
        <span class="repo-chip">Updated ${formatDate(repo.updated_at)}</span>
      </div>
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
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

  observeReveals();
}

async function loadRepos() {
  if (!repoContainers.length && !previewContainers.length) return;
  renderRepos(fallbackRepos);

  try {
    const response = await fetch("https://api.github.com/users/swarajfugare/repos?sort=updated&per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub API request failed");
    const repos = await response.json();
    renderRepos(repos);
  } catch {
    showToast("Showing saved GitHub project data because the live API is unavailable.");
  }
}

function observeReveals() {
  const revealItems = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

setTheme(storedTheme || (prefersDark ? "dark" : "light"));
if (year) year.textContent = String(new Date().getFullYear());
window.addEventListener("load", () => body.classList.add("is-loaded"));
body.classList.add("is-loaded");

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

navToggle?.addEventListener("click", () => {
  const isOpen = navPanel?.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

document.querySelectorAll(".nav-panel a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel?.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";
  const host = window.location.hostname;
  const canUseNetlify = host.includes("netlify.app") || (!host.includes("github.io") && host !== "localhost" && host !== "127.0.0.1" && host !== "");

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
  showToast("Opening your email app. GitHub Pages cannot store form submissions.");
});

observeReveals();
loadRepos();
