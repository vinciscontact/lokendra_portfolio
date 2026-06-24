/* ============================================================
   LOKENDRA PAGADALA — interactions
   Preloader · Lenis smooth scroll · GSAP ScrollTrigger
   custom cursor · magnetic buttons · reels · lightbox
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

// Always open at the top (home/hero) on reload — don't let the browser
// restore the previous scroll position.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const isTouch = window.matchMedia("(hover:none)").matches;
const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------- build reel cards ---------------- */
(function buildReels() {
  const track = document.getElementById("reelsTrack");
  if (!track) return;
  // Per-reel Instagram links (index 0 = Reel 01). Reel 07 is a portrait frame.
  const REELS = [
    "https://www.instagram.com/reel/C9M6Ox8yph4/?igsh=dzlidXR3d2pmc253",
    "https://www.instagram.com/reel/DMaCdSiPWYy/?igsh=MTZpbmJ5eG5oMjBhaA==",
    "https://www.instagram.com/reel/DQWmvwYjDsq/?igsh=anJodDRjMGhoajk0",
    "https://www.instagram.com/reel/DQddjh2j3PN/?igsh=MTlleGJ3ejhiM3Y2Yg==",
    "https://www.instagram.com/reel/DQjBfE6jxhZ/?igsh=MTl4NW50eGNmd3FidA==",
    "https://www.instagram.com/reel/DQs3mxpD1AL/?igsh=dXNkNDN0Mm5xczlm",
    "https://www.instagram.com/reel/DT2qgNpj4O5/?igsh=MTZia3pwdHBmanlrdg==",
    "https://www.instagram.com/reel/DRE-FB2Dyev/?igsh=NDA5aHlsM2ZwY29r",
    "https://www.instagram.com/reel/DWteNnsj-vr/?igsh=aTdjdzAxY2dwN280",
    "https://www.instagram.com/reel/DUz9WR4EW1d/?igsh=MWdoMHNzaGo5MXFmZQ==",
  ];
  let html = "";
  for (let n = 1; n <= 10; n++) {
    const id = String(n).padStart(2, "0");
    html += `
      <a class="reel-card" href="${REELS[n - 1]}" target="_blank" rel="noopener" data-cursor="hover" aria-label="Reel ${id} on Instagram">
        <img src="reels/${n}.jpeg" alt="Reel ${n}" decoding="async" />
        <div class="reel-card__play"><i></i></div>
        <div class="reel-card__meta"><span>Reel ${id}</span><span>Instagram ↗</span></div>
      </a>`;
  }
  track.innerHTML = html;
})();

/* ---------------- Lenis smooth scroll ---------------- */
let lenis;
function initLenis() {
  if (isTouch || typeof Lenis === "undefined") return;
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, lerp: 0.09 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* anchor links -> smooth scroll */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: "smooth" });
    });
  });
  document.getElementById("toTop")?.addEventListener("click", () => {
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------------- custom cursor ---------------- */
function initCursor() {
  if (isTouch) return;
  const cur = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const cp = { x: pos.x, y: pos.y };

  window.addEventListener("mousemove", (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    gsap.set(dot, { x: pos.x, y: pos.y });
  });
  gsap.ticker.add(() => {
    cp.x += (pos.x - cp.x) * 0.18;
    cp.y += (pos.y - cp.y) * 0.18;
    gsap.set(cur, { x: cp.x, y: cp.y });
  });

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    const type = el.getAttribute("data-cursor");
    el.addEventListener("mouseenter", () => cur.classList.add(type === "view" ? "is-view" : "is-hover"));
    el.addEventListener("mouseleave", () => cur.classList.remove("is-view", "is-hover"));
  });
}

/* ---------------- magnetic buttons ---------------- */
function initMagnetic() {
  if (isTouch) return;
  document.querySelectorAll(".btn-magnetic, .nav__cta").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      gsap.to(btn, { x: mx * 0.35, y: my * 0.45, duration: 0.6, ease: "power3.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
    });
  });
}

/* ---------------- preloader ---------------- */
function runPreloader(done) {
  const pre = document.getElementById("preloader");
  const count = document.getElementById("count");
  const fill = document.getElementById("barFill");
  const names = document.querySelectorAll(".preloader__name span");

  const tl = gsap.timeline();
  tl.to(names, { y: 0, duration: 1, ease: "power4.out", stagger: 0.12 }, 0.1);
  tl.to(fill, { width: "100%", duration: 1.8, ease: "power2.inOut" }, 0.1);
  tl.to({ v: 0 }, {
    v: 100, duration: 1.8, ease: "power2.inOut",
    onUpdate() { count.textContent = Math.round(this.targets()[0].v); },
  }, 0.1);
  tl.to(pre, {
    yPercent: -100, duration: 1, ease: "power4.inOut",
    onComplete() { pre.style.display = "none"; done(); },
  }, "+=0.25");
}

/* ---------------- hero intro ---------------- */
function heroIntro() {
  const words = document.querySelectorAll(".hero__title .word");
  gsap.from(".hero__portrait img", { opacity: 0, scale: 1.14, duration: 1.8, ease: "power3.out" });
  gsap.to(words, { y: 0, duration: 1.2, ease: "power4.out", stagger: 0.12 });
  gsap.from(".hero__meta, .hero__bottom", { opacity: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.5 });
  gsap.from(".nav", { opacity: 0, y: -20, duration: 1, ease: "power3.out", delay: 0.4 });

  // subtle mouse parallax on the portrait
  if (!isTouch) {
    const img = document.querySelector(".hero__portrait img");
    window.addEventListener("mousemove", (e) => {
      const dx = e.clientX / window.innerWidth - 0.5;
      const dy = e.clientY / window.innerHeight - 0.5;
      gsap.to(img, { x: dx * 36, y: dy * 26, duration: 1.1, ease: "power2.out", overwrite: "auto" });
    });
  }
}

/* ---------------- scroll reveals ---------------- */
function initReveals() {
  // hero portrait drifts up + fades as you leave the hero
  gsap.to(".hero__portrait img", {
    yPercent: -14,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // generic text/element reveals
  gsap.utils.toArray(".reveal-text").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 88%" },
      y: 40, opacity: 0, duration: 1, ease: "power3.out",
    });
  });

  // section titles split into lines (LET'S CREATE / contact)
  document.querySelectorAll(".contact__title .word").forEach((w) => {
    gsap.to(w, {
      scrollTrigger: { trigger: ".contact", start: "top 70%" },
      y: 0, duration: 1.1, ease: "power4.out", stagger: 0.1,
    });
  });

  // photo items rise + parallax
  gsap.utils.toArray(".photo__item").forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: "top 92%" },
      y: 80, opacity: 0, duration: 1.1, ease: "power3.out",
    });
    const img = item.querySelector("img");
    gsap.to(img, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  // about skills stagger
  gsap.from(".about__skills li", {
    scrollTrigger: { trigger: ".about__skills", start: "top 85%" },
    opacity: 0, x: -30, duration: 0.7, ease: "power3.out", stagger: 0.08,
  });

  // craft cards
  gsap.from(".craft__card", {
    scrollTrigger: { trigger: ".craft__cols", start: "top 85%" },
    opacity: 0, y: 50, duration: 0.9, ease: "power3.out", stagger: 0.12,
  });

  // stories / scripts poster cards
  gsap.from(".story-card", {
    scrollTrigger: { trigger: ".stories__grid", start: "top 88%" },
    opacity: 0, y: 40, duration: 0.8, ease: "power3.out", stagger: 0.12,
  });
}

/* ---------------- marquee ---------------- */
function initMarquee() {
  const track = document.querySelector(".marquee__track");
  if (!track) return;
  gsap.to(track, { xPercent: -50, repeat: -1, duration: 22, ease: "none" });
}

/* ---------------- horizontal reels pin ---------------- */
function initReelsScroll() {
  if (isTouch || window.innerWidth <= 900) return; // mobile uses native horizontal scroll
  const pin = document.getElementById("reelsPin");
  const track = document.getElementById("reelsTrack");
  if (!pin || !track) return;

  const getScroll = () =>
    Math.max(0, track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left) + 80);

  gsap.to(track, {
    x: () => -getScroll(),
    ease: "none",
    scrollTrigger: {
      trigger: "#reels",
      start: "top top",
      end: () => "+=" + getScroll(),
      scrub: 1,
      pin: pin,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // The track width depends on the reel images' natural sizes. If ScrollTrigger
  // measures before they decode, the scroll distance computes to ~0 (pin with no
  // movement). Refresh once every reel image has loaded so the distance is correct.
  const imgs = [...track.querySelectorAll("img")];
  let pending = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).length;
  if (pending === 0) {
    ScrollTrigger.refresh();
  } else {
    const done = () => { if (--pending === 0) ScrollTrigger.refresh(); };
    imgs.forEach((i) => {
      if (i.complete && i.naturalWidth > 0) return;
      i.addEventListener("load", done, { once: true });
      i.addEventListener("error", done, { once: true });
    });
  }
}

/* ---------------- nav contrast over light? (stays difference blend) ---------------- */

/* ---------------- lightbox ---------------- */
function initLightbox() {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const close = document.getElementById("lbClose");
  document.querySelectorAll(".photo__item").forEach((fig) => {
    fig.addEventListener("click", () => {
      lbImg.src = fig.getAttribute("data-img");
      lb.classList.add("open");
      lenis && lenis.stop();
    });
  });
  const hide = () => { lb.classList.remove("open"); lenis && lenis.start(); };
  close.addEventListener("click", hide);
  lb.addEventListener("click", (e) => { if (e.target === lb) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
}

/* ---------------- mobile menu overlay ---------------- */
function initMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (!btn || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  btn.addEventListener("click", () => setOpen(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  window.scrollTo(0, 0); // start at the hero before Lenis reads the position
  initLenis();
  if (lenis) lenis.scrollTo(0, { immediate: true });
  initAnchors();
  initCursor();
  initMagnetic();
  initMarquee();
  initReveals();
  initReelsScroll();
  initLightbox();
  initMenu();
  heroIntro();
  ScrollTrigger.refresh();
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0); // reset the restored scroll position on (re)load
  if (reduce) {
    document.getElementById("preloader").style.display = "none";
    gsap.set(".hero__title .word, .preloader__name span, .contact__title .word", { y: 0 });
    boot();
    return;
  }
  runPreloader(boot);
});
