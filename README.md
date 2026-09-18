# Helfy landing page

Landing page done in plain HTML / CSS / JS - no frameworks, no build step.

## Running it

Just open `index.html` in a browser. That's it.

## Structure

- `index.html` - markup, icons are an inline SVG sprite so it works from `file://` too
- `css/` - `tokens.css` (variables), `base.css` (reset, typography), `components.css` (buttons, carousel, menu), `sections.css` (page sections)
- `js/main.js` - sticky nav, menu drawer, carousels, ticker
- `assets/img/` - images (webp with srcset for hero, doctor and package)

## Notes

- The hero section has the id `real_helfy_hero_section` as required.
- Checked at 1920px, 1280px and 390px widths.
