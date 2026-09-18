# Helfy landing page

Landing page done in plain HTML / CSS / JS - no frameworks, no build step.

## Running it

Just open `index.html` in a browser. That's it.

Fonts (Poppins, Roboto) are loaded from Google Fonts, offline you get the system fallback.

## Structure

- `index.html` - markup, icons are an inline SVG sprite so it works from `file://` too
- `css/tokens.css` - variables (colors, fonts, radii, shadows, spacing)
- `css/base.css` - reset, typography, small utilities
- `css/components.css` - buttons, benefit pills, rating, review card, carousel, step cards, phone mockup, ticker, menu drawer
- `css/sections.css` - header, sticky nav, hero, testimonials, how it works, footer
- `js/main.js` - ticker, sticky nav, menu drawer, carousels
- `assets/img/` - images (webp with srcset for hero, doctor and package)

## Notes

- Hero section has the id `real_helfy_hero_section` as required.
- Checked at 1920 / 1280 / 390 and also 600, 768, 1024, 1100, 1600 in between. No horizontal scroll anywhere.
- Mobile first, desktop layout from 1024px, full design sizes at 1920px via `clamp()`.
- `prefers-reduced-motion` is respected (no marquee, no smooth scroll).

What's interactive:

- USP ticker at the top, pauses on hover
- sticky nav appears once the static header scrolls away (the "scroll" menu variant from Figma)
- CTA hover state from the prototype (#08972a, radius 20px)
- burger and search icon open the same menu drawer (Esc closes it, focus stays inside, returns to the button after)
- testimonials and how-it-works are scroll-snap carousels with buttons and dots; on desktop how-it-works is a static 3-column grid like in the design
- fixed bottom CTA on mobile (from the 390px frame)

## Assumptions

- The prototype only defines the CTA hover and the sticky nav. What's inside the menu drawer, how the carousels behave and where the links go (`#how-it-works`, socials `#`) is my call - there are no target pages in the file.
- The photos are cut-outs and Figma stretches them (the doctor is squashed to 459x349). I kept natural proportions and cropped instead.
- DMCA badge is shown whole - in the design file it's clipped to a few pixels, looks accidental.
- Carousel dots are one per reachable scroll position, not one per slide. So at 1920px all four reviews fit, one dot, arrows disabled. At 1280px two dots, on mobile four.
- Ticker copy is English in the design, kept as is (`lang="en"` on it). The design has both "3M+ Orders" and "1.5M+ Orders" for the same item, I used the first one.

## Not done

- "All Treatments", search and the avatar in the sticky nav go nowhere, it's a static page.
- Search form only prevents submit, there is no backend.

## Bonus - LLM review prompt

```
You are reviewing a static landing page (HTML, CSS, vanilla JS, no build step)
implemented from a Figma design at 1920 / 1280 / 390 px.
Files: index.html, css/tokens.css, css/base.css, css/components.css, css/sections.css, js/main.js.

Go through it in this order and be concrete (file + selector or line + fix):

1. Responsive: horizontal overflow, overlapping or clipped content anywhere between 320 and 1920px,
   especially the hero grid, the how-it-works cards and the fixed mobile CTA.
   Suggest clamp() / breakpoint changes with actual values.
2. Accessibility: heading order, landmarks, menu drawer focus handling (trap, Esc, return focus),
   carousel controls (aria-labels, disabled states, keyboard), decorative vs meaningful images,
   contrast of the green text (#008935) on the light backgrounds.
3. JS: race conditions in the carousel scroll / resize handling, the IntersectionObserver for the
   sticky nav, reduced-motion handling, anything that could throw.
4. CSS: repeated values that should be tokens, over-specific selectors, unused rules, BEM consistency.
5. Performance: image sizes / srcset, font loading, size of the inline SVG sprite, cost of the ticker animation.

Give a prioritized list (blocker / should fix / nice to have) with code snippets for the top 5 fixes.
Don't rewrite the whole project.
```
