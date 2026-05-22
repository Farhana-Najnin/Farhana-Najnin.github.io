const year = document.querySelector("#year");
const themeToggle = document.querySelector(".theme-toggle");
const cursorGlow = document.querySelector(".cursor-glow");
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const spotlightCards = document.querySelectorAll(".spotlight-card");
const spotlightDots = document.querySelectorAll(".spotlight-dots button");
const spotlightPrev = document.querySelector(".spotlight-btn.prev");
const spotlightNext = document.querySelector(".spotlight-btn.next");
let activeSpotlight = 0;

year.textContent = new Date().getFullYear();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

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

spotlightPrev?.addEventListener("click", () => showSpotlight(activeSpotlight - 1));
spotlightNext?.addEventListener("click", () => showSpotlight(activeSpotlight + 1));
spotlightDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => showSpotlight(dotIndex));
});

setInterval(() => {
  showSpotlight(activeSpotlight + 1);
}, 5500);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});



window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
  cursorGlow.classList.add("is-visible");
});

window.addEventListener("pointerleave", () => {
  cursorGlow?.classList.remove("is-visible");
});

