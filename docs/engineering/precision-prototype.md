## What it does

`precision-prototype` builds a single, highly-detailed UI workbench to settle layout, scale, and positioning decisions against real components. It focuses on crafting exactly one UI design wrapped in an isolated canvas with live in-memory parameter sync and one-click code write-back, rather than generating rapid multi-variant mockups or terminal apps.

The workbench embeds the real production component, isolates the viewport across device presets from mobile to kiosk displays, evaluates media queries accurately, and lets you bake validated parameters directly back into your source code files with zero manual copy-pasting.

## When to reach for it

Type `/precision-prototype`, or the [agent](https://www.aihero.dev/ai-coding-dictionary/agent) reaches for it automatically when a task fits.

| Your situation                                                                                          | Reach for                                                       |
| :------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------- |
| You need to dial in exact scale, spacing, or layout on a specific screen, mobile view, or kiosk display | `precision-prototype`                                           |
| You are exploring multiple competing visual directions or layout concepts                               | [prototype](https://aihero.dev/skills-prototype)                |
| You need to explore a pure state machine or business logic flow                                         | [prototype](https://aihero.dev/skills-prototype) (logic branch) |
| You want to model domain language, boundaries, and architectural records                                | [grill-with-docs](https://aihero.dev/skills-grill-with-docs)    |
| Something is broken or misaligned in existing production code                                           | [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)    |

## The workbench and canvas

The workbench separates the editing cockpit from the simulated display to guarantee accuracy and visibility:

- **Isolated iframe canvas.** The target component or page renders inside an isolated `<iframe>`. This ensures CSS media queries (`@media screen`) respond strictly to the simulated viewport width and height, rather than the host browser window or open developer tools.
- **Display presets and custom viewports.** Out of the box, the canvas provides one-click switching across standard handhelds (Mobile 390x844), tablets (768x1024), desktops (1440x900, 1920x1080), large public displays (Kiosk TV 16:9 1080p and 4K), and vertical signage (Kiosk TV 9:16 1080x1920), alongside custom numeric dimensions and orientation toggles.
- **Scale-to-fit zoom.** For large viewports such as a 4K kiosk display, CSS transform scaling automatically fits the simulated canvas into your laptop screen without clipping, distortion, or overflow, while preserving 100% 1:1 pixel inspection modes.
- **Anti-clumping cockpit layout.** Controls and state readouts live in an external sidebar strictly outside the canvas area. Opening browser DevTools (F12) never cramps or overlays controls across the previewed UI. The sidebar also provides a collapse toggle and an undock button to pop out controls into a separate window when inspecting in cramped spaces.

## Live sync and bake to code

Tuning parameters inside the workbench updates the real component immediately and can be persisted without manual copy-paste:

- **Direct in-canvas sync.** Adjusting sliders, numeric steppers, or toggles mutates live CSS custom properties, design tokens, or component props in memory. Changes reflect instantly without page reloads.
- **One-click "Bake to Code".** When parameters are dialed in, clicking "Bake to Code" triggers a dev-native endpoint (such as a temporary dev API route or Vite dev server middleware, with a lightweight helper script fallback) that updates the target source files and stylesheets on disk.
- **Summary toast with undo.** Successful writes display an immediate summary toast listing the modified files and values, alongside an "Undo" action to restore the previous state.
- **Dev-only retention.** The workbench and bake endpoint are guarded behind development-only checks (such as `process.env.NODE_ENV === 'development'`), remaining available for future tuning sessions without shipping to production builds.

## Common questions

**How does "Bake to Code" write back to my files without manual copy-paste?**

The agent sets up a lightweight development route (such as `/api/__precision_bake` in Next.js, SvelteKit, Astro, or Remix, or a Vite dev server middleware). When you click the bake button, the workbench sends a POST request with the tuned values, and the server writes them directly into the source files or CSS custom properties mapped during the initial [grilling](https://www.aihero.dev/ai-coding-dictionary/grilling) interview. In projects without an active server runtime, a tiny standalone helper script handles the write.

**Why render the component inside an iframe instead of a regular container div?**

CSS `@media` queries evaluate against the browsing context viewport. If a component is rendered inside a plain `div`, media queries respond to the developer's outer browser window, not the dimensions of the container. Wrapping the component in an iframe gives it a true viewport, allowing responsive breakpoints, typography scaling, and layout rules for mobile, tablet, and kiosk TV resolutions to trigger naturally.

**How do huge kiosk TV screens fit onto a laptop display?**

The canvas wraps the iframe in a CSS transform scale container. When you select a 1920x1080 or 4K kiosk preset on a smaller laptop screen, "Fit to Screen" mode computes the scaling factor needed to display the entire canvas within your available view without scrollbars or clipping, while keeping the internal DOM rendered at full native resolution.

**Why does the control panel live strictly outside the canvas, and what happens when I open DevTools (F12)?**

Fixed floating panels placed directly on top of the preview frequently collide with the layout, cover buttons, and become completely unusable when DevTools (F12) reduces the available screen area. By placing controls in a dedicated workbench sidebar outside the canvas, the preview and controls remain completely decoupled. If screen space is particularly constrained, you can collapse the sidebar or click "Pop Out" to move the controls into a separate browser window.

**Does the prototype code get deployed to production?**

No. The workbench route and bake endpoint are guarded behind development checks so they are excluded from production builds. The validated values themselves are written directly into the real production source code and committed to git, leaving production clean.

## It's working if

- The agent conducts a step-by-step interview covering purpose, scope, viewports, and bake target files before generating code.
- Exactly one interactive prototype workbench route is generated.
- The UI renders inside an isolated iframe with preset and custom viewport controls.
- The control panel sits outside the canvas and does not clump over the preview when DevTools (F12) opens.
- Adjusting sliders updates the live component instantly in memory.
- Clicking "Bake to Code" updates source files on disk, pops a summary toast, and provides an undo button.

## Where it fits

- **Role.** A reach-for-it-anytime standalone skill.
- **Neighbours.** Complements [prototype](https://aihero.dev/skills-prototype) (for rapid multi-variant exploration) and [grill-with-docs](https://aihero.dev/skills-grill-with-docs) (for deep domain modeling).
- **The map.** See [ask-matt](https://aihero.dev/skills-ask-matt) for the complete map of engineering skills.
