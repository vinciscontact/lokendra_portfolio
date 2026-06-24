# Lokendra Pagadala — Portfolio

A premium, dark monochrome portfolio for **Lokendra Pagadala** — videographer, photographer,
cinematographer, editor and storyteller. Built with **GSAP + ScrollTrigger**, a **Three.js**
particle background, and **Lenis** smooth scrolling. No build step — pure HTML/CSS/JS.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

Then visit the printed URL.

## Structure

```
index.html          # all sections (hero, about, photography, reels, craft, stories, contact)
css/style.css       # obsidian-monochrome design system
js/scene.js         # Three.js animated particle-wave background
js/main.js          # preloader, smooth scroll, scroll reveals, reels, lightbox, cursor
Photography/        # 6 stills (shown grayscale → colour on hover, click to enlarge)
reels/              # 10 reel cover frames (1–10.jpeg)
reels/_original/    # untouched backups of the reel images (not used by the site)
```

## Contact details (wired in)

- **Instagram:** [@pc.pixelss](https://www.instagram.com/pc.pixelss) — used in the contact grid
  and as the link target for every reel card.
- **Email:** lokendrapagadala19@gmail.com
- **Phone:** +91 93917 94974

## Still to do (optional)

1. **Per-reel deep links** — every reel card currently links to the Instagram *profile*
   (the `IG` constant in `buildReels()` in `js/main.js`). To deep-link each card to its own
   reel, replace the single `IG` URL with an array of 10 individual reel URLs.
2. **Bio copy** — the About and Stories sections use written placeholder copy; tweak freely.

## Notes on the reel images

The supplied reel screenshots were stored rotated 90°. They have been corrected to upright
(most are cinematic 16:9 frames; #6 was a vertical phone screenshot, cropped of its UI chrome).
Originals are preserved in `reels/_original/`. For the cleanest result, replacing them with
exported cover frames at consistent dimensions is recommended.

## Design

- **Theme:** obsidian black, monochrome, single high-contrast accent of pure white.
- **Type:** Syne (display) · Inter (body) · Space Mono (labels).
- Respects `prefers-reduced-motion` and degrades gracefully on touch devices.
