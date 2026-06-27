const year = document.querySelector("#year");
const themeToggle = document.querySelector(".theme-toggle");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const cursorGlow = document.querySelector(".cursor-glow");
const spotlightWindow = document.querySelector(".spotlight-window");
const spotlightCards = [...document.querySelectorAll(".spotlight-card")];
const spotlightDots = [...document.querySelectorAll(".spotlight-dots button")];
const spotlightPrev = document.querySelector(".spotlight-prev");
const spotlightNext = document.querySelector(".spotlight-next");
const filterButtons = [...document.querySelectorAll(".filter")];
const projectCards = [...document.querySelectorAll(".project-card")];
const skillCarousel = document.querySelector(".skill-carousel");
const skillTrack = document.querySelector(".skill-carousel-track");
const skillSlides = [...document.querySelectorAll(".skill-panel")];
const skillDots = [...document.querySelectorAll(".skill-dots button")];
const skillPrev = document.querySelector(".skill-prev");
const skillNext = document.querySelector(".skill-next");
const skillCurrent = document.querySelector(".skill-current");
const skillCurrentLabel = document.querySelector(".skill-current-label");
const skillProgress = document.querySelector(".skill-progress span");
const certificateButtons = [...document.querySelectorAll(".certificate-image-button")];
const certificateDialog = document.querySelector(".certificate-dialog");
const certificateDialogImage = certificateDialog?.querySelector("img");
const certificateDialogTitle = certificateDialog?.querySelector("#certificate-dialog-title");
const certificateDialogClose = certificateDialog?.querySelector(".certificate-dialog-close");

let activeSpotlight = 0;
let spotlightTimer;
let activeSkill = 0;
let skillTimer;

if (year) {
  year.textContent = new Date().getFullYear();
}

function refreshIcons() {
  window.lucide?.createIcons();
}

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");

  if (themeToggle) {
    themeToggle.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon"}"></i>`;
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  }

  refreshIcons();
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme ? savedTheme === "dark" : prefersDark);

themeToggle?.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark"));
});

function setMenu(open) {
  navigation?.classList.toggle("open", open);
  document.body.classList.toggle("nav-open", open);
  menuToggle?.setAttribute("aria-expanded", String(open));

  if (menuToggle) {
    menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  }

  refreshIcons();
}

menuToggle?.addEventListener("click", () => {
  setMenu(!navigation?.classList.contains("open"));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 920) setMenu(false);
});

function showSpotlight(index) {
  if (!spotlightCards.length) return;

  activeSpotlight = (index + spotlightCards.length) % spotlightCards.length;
  spotlightCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeSpotlight);
  });
  spotlightDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSpotlight);
  });
}

function startSpotlightTimer() {
  window.clearInterval(spotlightTimer);
  spotlightTimer = window.setInterval(() => showSpotlight(activeSpotlight + 1), 6000);
}

spotlightPrev?.addEventListener("click", () => {
  showSpotlight(activeSpotlight - 1);
  startSpotlightTimer();
});

spotlightNext?.addEventListener("click", () => {
  showSpotlight(activeSpotlight + 1);
  startSpotlightTimer();
});

spotlightDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    showSpotlight(dotIndex);
    startSpotlightTimer();
  });
});

spotlightWindow?.addEventListener("mouseenter", () => window.clearInterval(spotlightTimer));
spotlightWindow?.addEventListener("mouseleave", startSpotlightTimer);
spotlightWindow?.addEventListener("focusin", () => window.clearInterval(spotlightTimer));
spotlightWindow?.addEventListener("focusout", startSpotlightTimer);
showSpotlight(0);
startSpotlightTimer();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter || "all";

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

function showSkillSlide(index) {
  if (!skillSlides.length || !skillTrack) return;

  activeSkill = (index + skillSlides.length) % skillSlides.length;
  skillTrack.style.transform = `translateX(-${activeSkill * 100}%)`;

  skillSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSkill;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  skillDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeSkill);
  });

  if (skillCurrent) skillCurrent.textContent = String(activeSkill + 1).padStart(2, "0");
  if (skillCurrentLabel) skillCurrentLabel.textContent = skillSlides[activeSkill].dataset.label || "Skills";
  if (skillProgress) skillProgress.style.width = `${((activeSkill + 1) / skillSlides.length) * 100}%`;
}

function startSkillTimer() {
  window.clearInterval(skillTimer);
  skillTimer = window.setInterval(() => showSkillSlide(activeSkill + 1), 4800);
}

skillPrev?.addEventListener("click", () => {
  showSkillSlide(activeSkill - 1);
  startSkillTimer();
});

skillNext?.addEventListener("click", () => {
  showSkillSlide(activeSkill + 1);
  startSkillTimer();
});

skillDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    showSkillSlide(dotIndex);
    startSkillTimer();
  });
});

skillCarousel?.addEventListener("mouseenter", () => window.clearInterval(skillTimer));
skillCarousel?.addEventListener("mouseleave", startSkillTimer);
skillCarousel?.addEventListener("focusin", () => window.clearInterval(skillTimer));
skillCarousel?.addEventListener("focusout", startSkillTimer);

showSkillSlide(0);
startSkillTimer();

certificateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const source = button.dataset.certificateSrc;
    const title = button.dataset.certificateTitle || "Certificate preview";

    if (!source) return;

    if (!certificateDialog?.showModal || !certificateDialogImage || !certificateDialogTitle) {
      window.open(source, "_blank", "noopener,noreferrer");
      return;
    }

    certificateDialogImage.src = source;
    certificateDialogImage.alt = title;
    certificateDialogTitle.textContent = title;
    certificateDialog.showModal();
  });
});

certificateDialogClose?.addEventListener("click", () => certificateDialog.close());

certificateDialog?.addEventListener("click", (event) => {
  if (event.target === certificateDialog) certificateDialog.close();
});

certificateDialog?.addEventListener("close", () => {
  if (!certificateDialogImage) return;
  certificateDialogImage.src = "";
  certificateDialogImage.alt = "";
});

const experienceSection = document.querySelector("#experience");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -5%" }
);

document.querySelectorAll(".reveal").forEach((item) => {
  Array.from(item.children).forEach((child, index) => {
    child.style.setProperty("--reveal-index", Math.min(index, 8));
  });

  const startsAtExperience =
    !experienceSection ||
    experienceSection.contains(item) ||
    Boolean(experienceSection.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING);

  if (startsAtExperience) {
    item.classList.add("scroll-reveal");
    revealObserver.observe(item);
  }
});

const navLinks = [...document.querySelectorAll(".nav-links a")];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navigationObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleEntry) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visibleEntry.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -58%", threshold: [0.05, 0.2, 0.5] }
);

trackedSections.forEach((section) => navigationObserver.observe(section));

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.classList.add("is-visible");
});

window.addEventListener("pointerleave", () => {
  cursorGlow?.classList.remove("is-visible");
});

refreshIcons();
