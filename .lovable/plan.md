# Plan: Docket landing page

## Goal
Create a polished Docket landing page that closely matches the uploaded reference: soft premium glass, pale grid backdrop, dark crisp typography, indigo action accents, capsule controls, dashboard-style product visuals, and consistent spacing across every section.

## What will change
- Replace the current blank home page with the complete Docket landing page at `/`.
- Add page-specific metadata for Docket: title, description, Open Graph, and Twitter card details.
- Update the visual theme tokens so the page uses a cohesive off-white, mist-blue, graphite, and indigo palette instead of default styling.
- Load matching modern sans typography through the page head, without adding remote CSS imports.

## Page structure
1. **Global navigation**
   - Minimal Docket brand mark on the left.
   - Center links: Features and Security.
   - Right capsule button: Sign In.

2. **Hero**
   - Premium muted background with the same airy grid and soft glass feel as the reference.
   - Headline: `Your family's life. Organized.`
   - Subtext: `Insurance, warranties, medical reports, and vehicle papers in one secure vault.`
   - Primary action: `Sign In with Google` with an inline Google-style mark.
   - Large dashboard mockup emerging from the bottom, showing categorized document cards such as Car Insurance and Pediatrician Report.

3. **The Magic: Auto-Extraction**
   - Bento-style split composition.
   - Left side: raw cluttered insurance-policy PDF mockup.
   - Scroll/entry animation: glowing scan line.
   - Right side: clean extracted metadata card with issuer, type, and critical dates.
   - Copy exactly follows the provided headline and subtext.

4. **The Utility: Expiry Tracking**
   - Spacious centered layout.
   - Beautiful timeline widget with a red upcoming expiry indicator: `Vehicle Registration - Expires in 14 Days.`
   - Copy exactly follows the provided headline and subtext.

5. **The Network: Role-Based Access**
   - Alternating horizontal layout.
   - Translucent household roster panel with three avatars and tags: Owner, Adult, Viewer.
   - Copy exactly follows the provided headline and subtext.

6. **Privacy & Security**
   - Deep black high-contrast section with Apple-like privacy feel.
   - Intricate metallic padlock visual using layered CSS/SVG, with a restrained snap/lock animation on entry.
   - Copy exactly follows the provided headline and subtext.

7. **Bottom call to action**
   - Expansive whitespace and centered copy.
   - Headline: `Take control of the paperwork.`
   - Primary action: `Sign In with Google`.
   - Subtext: `No separate account required. Setup takes seconds.`

8. **Footer**
   - Left: `© 2026 Docket. All rights reserved.`
   - Right: `Privacy Policy | Terms of Service`.

## Mobile responsiveness
- Navigation collapses cleanly without clipping text.
- Hero dashboard scales down and remains readable on phones.
- Split sections stack vertically on smaller screens.
- Document cards, bento areas, timelines, avatars, and action buttons keep stable dimensions and spacing.
- Typography uses fixed responsive breakpoints, not viewport-based scaling.

## Technical details
- Use the uploaded screenshot as a visual reference only; it will not be embedded as an image.
- Implement with React in the existing TanStack Start home route.
- Use semantic theme tokens in `src/styles.css` for all colors, borders, surfaces, shadows, and accents.
- Keep visual styling token-based in the page code.
- Use lightweight CSS/SVG mockups for the dashboard, PDF, scan line, timeline, roster, and lock so the page remains fast and adaptive.
- Respect reduced-motion settings for scroll and entrance animations.
