import "./styles/main.css";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const NAV_BREAK = 768;

function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#nav-toggle");
  const nav = document.querySelector<HTMLElement>("#primary-nav");
  const backdrop = document.querySelector<HTMLElement>("#nav-backdrop");
  if (!toggle || !nav || !backdrop) return;

  const setOpen = (open: boolean): void => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-is-open", open);
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
  };

  const close = (): void => setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  backdrop.addEventListener("click", close);

  nav.querySelectorAll<HTMLAnchorElement>("a[href^='#']").forEach((a) => {
    a.addEventListener("click", () => {
      if (window.matchMedia(`(max-width: ${NAV_BREAK - 1}px)`).matches) {
        close();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-is-open")) {
      close();
      toggle.focus();
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= NAV_BREAK) close();
    },
    { passive: true }
  );
}

function initReveal(): void {
  const els = document.querySelectorAll<HTMLElement>(".reveal");
  if (!els.length) return;

  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  els.forEach((el) => io.observe(el));
}

function initHeroParallax(): void {
  if (prefersReducedMotion) return;

  const media = document.querySelector<HTMLElement>("[data-parallax]");
  const img = media?.querySelector<HTMLImageElement>("img");
  if (!media || !img) return;

  let ticking = false;
  const update = (): void => {
    ticking = false;
    const y = Math.min(window.scrollY * 0.06, 72);
    img.style.transform = `translate3d(0, ${y}px, 0) scale(1.04)`;
  };

  const onScroll = (): void => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
}

initReveal();
initHeroParallax();
initMobileNav();
